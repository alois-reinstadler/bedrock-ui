import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const root = fileURLToPath(new URL('../', import.meta.url));
const provenance = JSON.parse(await readFile(join(root, 'vendor/astra-motion.json'), 'utf8'));
const archive = join(root, 'vendor', provenance.archive);
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
for (const entry of entries.filter(
	(entry) => !entry.endsWith('/') && entry !== 'package/package.json'
)) {
	const expected = execFileSync('tar', ['-xOzf', archive, entry]);
	assert.deepEqual(
		await readFile(join(installedRoot, entry.slice('package/'.length))),
		expected,
		`Stale installed file: ${entry}`
	);
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

const directory = await mkdtemp(join(tmpdir(), 'bedrock-motion-'));
try {
	for (const [name, module, exports, forbidMotion] of [
		['css', 'css.ts', ['CssButton', 'CssPanel', 'createMotion'], true],
		['config', 'config.ts', ['MotionConfig'], true],
		['legacy', 'index.ts', ['appear', 'LayoutGroup', 'Swap'], true],
		['engine', 'engine.ts', ['Motion', 'createMotion', 'createLayout', 'motionStore'], false],
		['projection', 'projection.ts', ['createLayout', 'updateLayout'], false],
		['scroll', 'scroll.ts', ['createScroll'], false],
		['values', 'values.ts', ['motionValue', 'motionStore'], false]
	]) {
		const id = '\0bedrock-motion-check';
		const result = await build({
			configFile: false,
			root,
			logLevel: 'error',
			plugins: [
				{
					name: 'motion-check-entry',
					resolveId(source) {
						if (source.endsWith('motion-check-entry')) return id;
					},
					load(source) {
						if (source === id)
							return `export { ${exports.join(', ')} } from ${JSON.stringify(join(root, 'src/lib/bedrock/motion', module))};`;
					}
				},
				svelte({ configFile: false })
			],
			resolve: { alias: { '#lib': join(root, 'src/lib') } },
			build: {
				outDir: directory,
				write: false,
				minify: false,
				lib: { entry: 'motion-check-entry', formats: ['es'] }
			}
		});
		const chunks = (Array.isArray(result) ? result : [result])
			.flatMap((output) => output.output)
			.filter((chunk) => chunk.type === 'chunk');
		const rendered = chunks.flatMap((chunk) =>
			Object.entries(chunk.modules)
				.filter(([, metadata]) => metadata.renderedLength > 0)
				.map(([id]) => id)
		);
		if (forbidMotion)
			assert(
				!rendered.some((id) => /node_modules\/(?:motion|motion-dom|motion-utils)\//.test(id)),
				`${name} unexpectedly includes Motion runtime`
			);
		assert(
			!rendered.some((id) => /astra-motion.*\/routes\./.test(id)),
			`${name} unexpectedly imports Kit route adapter`
		);
		console.log(
			`${name}: bundled public exports; ${rendered.length} rendered modules${forbidMotion ? ', no Motion runtime' : ''}.`
		);
	}
} finally {
	await rm(directory, { recursive: true, force: true });
}
