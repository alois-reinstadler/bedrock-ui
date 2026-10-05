import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Keep these consumer fixtures stable across dependency/component upgrades.
// They mount real components, allowing normal application tree shaking.
export function motionFixtures(root) {
	const component = (
		path,
		props = '{}',
		named = ''
	) => `import { mount, createRawSnippet } from 'svelte';
import ${named ? `{ ${named} as Component }` : 'Component'} from ${JSON.stringify(join(root, path))};
const children = createRawSnippet(() => ({ render: () => '<span>Save changes</span>' }));
mount(Component, { target: document.body, props: { children, ...${props} } });`;
	return [
		{
			name: 'button',
			noEngine: true,
			noLegacyLayout: true,
			source: component('src/lib/bedrock/ui/button/button.svelte')
		},
		{
			name: 'config',
			source: component(
				'src/lib/bedrock/motion/config.ts',
				"{ reducedMotion: 'user' }",
				'MotionConfig'
			)
		},
		{
			name: 'legacy',
			noEngine: true,
			source: `export { appear, LayoutGroup, Swap } from ${JSON.stringify(join(root, 'src/lib/bedrock/motion/index.ts'))};`
		},
		{
			name: 'async-button',
			noLegacyLayout: true,
			source: component(
				'src/lib/bedrock/ui/async-button/async-button.svelte',
				'{ action: async () => {} }'
			)
		},
		{
			name: 'avatar-stack',
			noLegacyLayout: true,
			source: component(
				'src/lib/bedrock/ui/avatar/avatar-stack.svelte',
				"{ items: [{ fallback: 'AL', name: 'Alex' }, { fallback: 'BK', name: 'Blake' }] }"
			)
		}
	];
}

export function inspectGraph(name, rendered, noEngine = false, noLegacyLayout = false) {
	if (noLegacyLayout)
		assert(
			!rendered.some((id) =>
				/\/bedrock\/motion\/(?:layout\.svelte\.[jt]s|layout-group\.svelte)(?:\?|$)/.test(id)
			),
			`${name} unexpectedly includes Bedrock's compatibility layout engine`
		);
	const engines = new Set();
	const packageRoots = new Map();
	for (const id of rendered) {
		assert(!/\/(?:react|react-dom|react-is)\//.test(id), `${name} includes React: ${id}`);
		assert(
			!/astra-motion\/dist\/motion\/(?:routes|view-navigation)(?:\.|\/)/.test(id),
			`${name} imports a Kit route adapter: ${id}`
		);
		const bundled = id.match(
			/^(.*\/astra-motion\/dist\/motion\/vendor)\/(motion-dom|motion-utils|framer-motion)\//
		);
		const external = id.match(
			/^(.*\/node_modules)\/(motion|motion-dom|motion-utils|framer-motion)\//
		);
		const match = bundled ?? external;
		if (!match) continue;
		const identity = `${bundled ? 'bundled' : 'external'}:${match[1]}`;
		engines.add(identity);
		const roots = packageRoots.get(match[2]) ?? new Set();
		roots.add(identity);
		packageRoots.set(match[2], roots);
	}
	// External pnpm modules legitimately have different parent directories, so
	// check each package identity and reject mixing those with Astra's engine.
	for (const [pkg, roots] of packageRoots)
		assert(roots.size === 1, `${name} includes duplicate ${pkg} identities: ${[...roots]}`);
	const bundledRoots = [...engines].filter((id) => id.startsWith('bundled:'));
	assert(bundledRoots.length <= 1, `${name} includes multiple Astra engines`);
	assert(
		!(bundledRoots.length && [...engines].some((id) => id.startsWith('external:'))),
		`${name} mixes bundled and external Motion engines`
	);
	if (noEngine) assert.equal(engines.size, 0, `${name} unexpectedly includes Motion runtime`);
	return [...engines];
}

export async function measureFixture(root, fixture) {
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
					if (source === id) return fixture.source;
				}
			},
			svelte({ configFile: false })
		],
		resolve: {
			alias: [
				{
					find: /^#lib\/bedrock\/ui\/([^/]+)$/,
					replacement: join(root, 'src/lib/bedrock/ui/$1/index.ts')
				},
				{ find: '#lib', replacement: join(root, 'src/lib') }
			]
		},
		build: {
			write: false,
			minify: true,
			lib: { entry: 'motion-check-entry', formats: ['es'] }
		}
	});
	const output = (Array.isArray(result) ? result : [result]).flatMap((result) => result.output);
	const chunks = output.filter((chunk) => chunk.type === 'chunk');
	const rendered = [
		...new Set(
			chunks.flatMap((chunk) =>
				Object.entries(chunk.modules)
					.filter(([, metadata]) => metadata.renderedLength > 0)
					.map(([id]) => id)
			)
		)
	];
	const engines = inspectGraph(fixture.name, rendered, fixture.noEngine, fixture.noLegacyLayout);
	return {
		name: fixture.name,
		jsRaw: chunks.reduce((total, chunk) => total + Buffer.byteLength(chunk.code), 0),
		jsGzip: chunks.reduce((total, chunk) => total + gzipSync(chunk.code).length, 0),
		cssRaw: output
			.filter((chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css'))
			.reduce((total, chunk) => total + Buffer.byteLength(chunk.source), 0),
		modules: rendered.length,
		engineIdentities: engines,
		rendered: rendered.map((id) => id.replace(root, '<root>'))
	};
}

// One real multi-entry build: warm bytes exclude the transitive chunks loaded by
// the fixed public engine reference. Do not subtract independently gzipped bundles.
export async function measureSharedFixtures(root) {
	const fixtures = motionFixtures(root).filter(({ name }) =>
		['button', 'async-button', 'avatar-stack'].includes(name)
	);
	fixtures.push({
		name: 'engine-reference',
		source:
			"import { motion, createLayout, presence } from 'astra-motion'; window.__bedrockEngineReference = { bind: motion.bind, createLayout, presence };"
	});
	const prefix = '\0bedrock-shared:';
	const result = await build({
		configFile: false,
		root,
		logLevel: 'error',
		plugins: [
			{
				name: 'bedrock-shared-fixtures',
				resolveId(source) {
					if (source.startsWith('bedrock-shared:')) return '\0' + source;
				},
				load(id) {
					if (id.startsWith(prefix))
						return fixtures.find((f) => f.name === id.slice(prefix.length))?.source;
				}
			},
			svelte({ configFile: false })
		],
		resolve: {
			alias: [
				{
					find: /^#lib\/bedrock\/ui\/([^/]+)$/,
					replacement: join(root, 'src/lib/bedrock/ui/$1/index.ts')
				},
				{ find: '#lib', replacement: join(root, 'src/lib') }
			]
		},
		build: {
			write: false,
			minify: true,
			rolldownOptions: {
				input: Object.fromEntries(fixtures.map((f) => [f.name, 'bedrock-shared:' + f.name])),
				output: {
					format: 'es',
					entryFileNames: '[name].js',
					chunkFileNames: 'chunks/[name]-[hash].js'
				}
			}
		}
	});
	const chunks = (Array.isArray(result) ? result : [result])
		.flatMap((r) => r.output)
		.filter((c) => c.type === 'chunk');
	const byName = new Map(chunks.map((c) => [c.fileName, c]));
	function closure(name, visited = new Set()) {
		if (visited.has(name)) return visited;
		visited.add(name);
		for (const dependency of byName.get(name)?.imports ?? []) closure(dependency, visited);
		return visited;
	}
	const engine = closure('engine-reference.js');
	function bytes(names) {
		const selected = [...names].map((name) => byName.get(name)).filter(Boolean);
		return {
			raw: selected.reduce((n, c) => n + Buffer.byteLength(c.code), 0),
			gzip: selected.reduce((n, c) => n + gzipSync(c.code).length, 0),
			chunks: selected.map((c) => c.fileName)
		};
	}
	return {
		engineReference: bytes(engine),
		consumers: fixtures
			.filter((f) => f.name !== 'engine-reference')
			.map((f) => {
				const initial = closure(f.name + '.js');
				const warm = new Set([...initial].filter((name) => !engine.has(name)));
				const rendered = [
					...new Set(
						[...initial].flatMap((name) =>
							Object.entries(byName.get(name)?.modules ?? {})
								.filter(([, m]) => m.renderedLength > 0)
								.map(([id]) => id)
						)
					)
				];
				return {
					name: f.name,
					initial: bytes(initial),
					engineWarm: bytes(warm),
					engineIdentities: inspectGraph(f.name, rendered, f.noEngine, f.noLegacyLayout)
				};
			})
	};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	const root = resolve(process.argv[2] ?? '.');
	const measurements = [];
	for (const fixture of motionFixtures(root)) {
		const measurement = await measureFixture(root, fixture);
		measurements.push(measurement);
		console.log(
			`${measurement.name}: JS ${measurement.jsRaw} B raw / ${measurement.jsGzip} B gzip; ${measurement.modules} modules; ${measurement.engineIdentities.length} engine roots`
		);
	}
	const shared = await measureSharedFixtures(root);
	console.log(
		'Shared fixtures:',
		JSON.stringify(
			shared.consumers.map(({ name, initial, engineWarm }) => ({
				name,
				initial: initial.gzip,
				engineWarm: engineWarm.gzip
			}))
		)
	);
	if (process.argv[3])
		await writeFile(
			process.argv[3],
			JSON.stringify(
				{
					root,
					node: process.version,
					vite: JSON.parse(
						await readFile(new URL('../node_modules/vite/package.json', import.meta.url), 'utf8')
					).version,
					lockfileSha256: createHash('sha256')
						.update(await readFile(join(root, 'pnpm-lock.yaml')))
						.digest('hex'),
					archive: JSON.parse(await readFile(join(root, 'vendor/astra-motion.json'), 'utf8'))
						.sha256,
					measurements,
					shared
				},
				null,
				2
			) + '\n'
		);
}
