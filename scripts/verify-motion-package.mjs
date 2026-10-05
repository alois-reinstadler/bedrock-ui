import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	measureFixture,
	measureSharedFixtures,
	motionFixtures
} from './measure-motion-bundles.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const provenance = JSON.parse(await readFile(join(root, 'vendor/astra-motion.json'), 'utf8'));
const archive = join(root, 'vendor', provenance.archive);
assert.equal(
	createHash('sha256')
		.update(await readFile(resolve(root, provenance.snapshotManifest)))
		.digest('hex'),
	provenance.snapshotManifestSha256,
	'Source snapshot manifest changed; review provenance'
);
const digest = createHash('sha256')
	.update(await readFile(archive))
	.digest('hex');
assert.equal(
	digest,
	provenance.sha256,
	'Vendored Astra archive changed; review and update provenance'
);
const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n');
assert(entries.every((entry) => entry.startsWith('package/') && !entry.split('/').includes('..')));
assert(!entries.some((entry) => /(?:\.spec\.|\.test\.|\.env|node_modules\/)/.test(entry)));
const packed = JSON.parse(
	execFileSync('tar', ['-xOzf', archive, 'package/package.json'], { encoding: 'utf8' })
);
assert.equal(packed.name, 'astra-motion');
assert.equal(packed.version, provenance.version);
assert.equal(packed.license, 'MIT');
assert(!packed.exports['./css'], 'Removed CSS backend unexpectedly returned');
for (const notice of ['LICENSE', ...provenance.bundledNotices, provenance.bundledProvenance])
	assert(entries.includes(`package/${notice}`), `Missing license/provenance: ${notice}`);
const installedRoot = resolve(dirname(fileURLToPath(import.meta.resolve('astra-motion'))), '..');
const installed = JSON.parse(await readFile(join(installedRoot, 'package.json'), 'utf8'));
for (const field of [
	'name',
	'version',
	'exports',
	'dependencies',
	'peerDependencies',
	'peerDependenciesMeta',
	'sideEffects'
]) {
	assert.deepEqual(installed[field], packed[field], `Installed package metadata differs: ${field}`);
}
const extracted = await mkdtemp(join(tmpdir(), 'bedrock-astra-integrity-'));
try {
	execFileSync('tar', ['-xzf', archive, '-C', extracted]);
	for (const entry of entries.filter(
		(entry) => !entry.endsWith('/') && entry !== 'package/package.json'
	)) {
		const expected = await readFile(join(extracted, entry));
		assert.deepEqual(
			await readFile(join(installedRoot, entry.slice('package/'.length))),
			expected,
			`Stale installed file: ${entry}`
		);
	}
} finally {
	await rm(extracted, { recursive: true, force: true });
}
for (const subpath of Object.keys(packed.exports)) {
	const value = packed.exports[subpath];
	for (const target of typeof value === 'string' ? [value] : Object.values(value)) {
		assert(entries.includes(`package/${target.replace(/^\.\//, '')}`), `Missing export: ${target}`);
	}
}
console.log(
	`Archive integrity and installed content: ${entries.length} entries verified (${digest}).`
);

const bundleBudgets = JSON.parse(await readFile(join(root, 'scripts/motion-budgets.json'), 'utf8'));
const fixtures = motionFixtures(root);
// Helper users should never activate the compatible LayoutGroup barrel.
fixtures.push({
	name: 'native-helpers',
	noEngine: true,
	noLegacyLayout: true,
	source: `import { mount, createRawSnippet } from 'svelte';
import Swap from ${JSON.stringify(join(root, 'src/lib/bedrock/motion/swap.svelte'))};
export { autoSize } from ${JSON.stringify(join(root, 'src/lib/bedrock/motion/auto-size.ts'))};
export { reveal } from ${JSON.stringify(join(root, 'src/lib/bedrock/motion/presence.ts'))};
mount(Swap, { target: document.body, props: { key: 1, children: createRawSnippet(() => ({ render: () => '<span>Content</span>' })) } });`
});
for (const [name, module, exports] of [
	[
		'engine',
		'engine.ts',
		['motion', 'AnimatePresence', 'MotionConfig', 'createLayout', 'motionStore']
	],
	['projection', 'projection.ts', ['createLayout', 'updateLayout']],
	['scroll', 'scroll.ts', ['createScroll']],
	['values', 'values.ts', ['motionValue', 'motionStore']]
])
	fixtures.push({
		name,
		source: `export { ${exports.join(', ')} } from ${JSON.stringify(join(root, 'src/lib/bedrock/motion', module))};`
	});
for (const [name, entry, exported] of [
	['text', 'astra-motion/text', 'TextReveal, TextSwap'],
	['tilt', 'astra-motion/tilt', 'Tilt']
])
	fixtures.push({
		name,
		noLegacyLayout: true,
		source: `export { ${exported} } from '${entry}';`
	});
fixtures.push({
	name: 'tilt-card',
	noLegacyLayout: true,
	source: `import { mount, createRawSnippet } from 'svelte';
import TiltCard from ${JSON.stringify(join(root, 'src/lib/bedrock/ui/tilt-card/tilt-card.svelte'))};
mount(TiltCard, { target: document.body, props: { children: createRawSnippet(() => ({ render: () => '<span>Card</span>' })) } });`
});
for (const fixture of fixtures) {
	const result = await measureFixture(root, fixture);
	const budget = bundleBudgets.consumers[fixture.name];
	if (budget)
		assert(
			result.jsGzip <= budget.standaloneGzip,
			`${fixture.name}: ${result.jsGzip} B gzip exceeds standalone budget ${budget.standaloneGzip}; inspect imports before changing the budget`
		);
	if (['text', 'tilt', 'tilt-card'].includes(fixture.name)) {
		assert(
			!result.rendered.some((id) => /astra-motion\/dist\/motion\/factory\./.test(id)),
			`${fixture.name} imports the full component factory`
		);
	}
	if (fixture.name === 'text')
		assert(
			!result.rendered.some((id) =>
				/astra-motion\/dist\/motion\/(?:Tilt|tilt-controller)/.test(id)
			),
			'Text imports tilt'
		);
	if (fixture.name === 'tilt' || fixture.name === 'tilt-card')
		assert(
			!result.rendered.some((id) =>
				/astra-motion\/dist\/motion\/Text(?:Reveal|Swap|Visual)/.test(id)
			),
			'Tilt imports text'
		);
	console.log(
		`${result.name}: ${result.modules} modules, ${result.jsGzip} B gzip${fixture.noEngine ? ', no Motion runtime' : ''}.`
	);
}

// Warm cost comes from one multi-entry build, never subtraction of independent gzip totals.
const shared = await measureSharedFixtures(root);
for (const consumer of shared.consumers) {
	const budget = bundleBudgets.consumers[consumer.name];
	assert(
		consumer.engineWarm.gzip <= budget.engineWarmGzip,
		`${consumer.name}: ${consumer.engineWarm.gzip} B gzip exceeds engine-warm budget ${budget.engineWarmGzip}`
	);
	console.log(
		`${consumer.name}: ${consumer.engineWarm.gzip} B gzip with the fixed engine reference already loaded.`
	);
}
