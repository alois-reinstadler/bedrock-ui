import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = '.svelte-kit/output/client';
const manifest = JSON.parse(fs.readFileSync(path.join(root, '.vite/manifest.json'), 'utf8'));
const example = 'src/lib/site/map-examples/LazyMapExample.svelte';
const eagerExample = 'src/lib/site/map-examples/BasicMapExample.svelte';
function closure(entry, dynamic = false, found = new Set()) {
	if (found.has(entry)) return found;
	const asset = manifest[entry];
	if (!asset) throw new Error(`Missing manifest entry ${entry}; run pnpm build first.`);
	found.add(entry);
	for (const dependency of [
		...(asset.imports ?? []),
		...(dynamic ? (asset.dynamicImports ?? []) : [])
	])
		closure(dependency, dynamic, found);
	return found;
}
function bytes(entries) {
	let raw = 0,
		gzip = 0;
	for (const entry of entries) {
		const file = manifest[entry].file;
		if (!file.endsWith('.js')) continue;
		const data = fs.readFileSync(path.join(root, file));
		raw += data.length;
		gzip += gzipSync(data).length;
	}
	return { raw, gzip };
}
const initial = closure(example);
const eventual = closure(example, true);
const eager = closure(eagerExample);
const engine = [...eager].filter((key) =>
	fs.readFileSync(path.join(root, manifest[key].file), 'utf8').includes('GPUInitializationError')
);
if (!engine.length) throw new Error('Could not identify MapLibre engine chunk.');
if (engine.some((key) => initial.has(key))) throw new Error('LazyMap eagerly imports MapLibre.');
if (engine.some((key) => !eventual.has(key)))
	throw new Error('LazyMap cannot reach the MapLibre chunk dynamically.');
const deferred = new Set([...eventual].filter((key) => !initial.has(key)));
const workers = fs
	.readdirSync(root, { recursive: true })
	.filter((file) => /(?:^|\/)maplibre-gl-worker.*\.js$/.test(file));
if (!workers.length) throw new Error('The bundled MapLibre worker is missing.');
for (const file of workers) {
	const code = fs.readFileSync(path.join(root, file), 'utf8');
	if (/from["']\.\/maplibre-gl-shared\.mjs/.test(code))
		throw new Error('Worker contains an unresolved upstream shared-module import.');
}
console.log(
	JSON.stringify(
		{
			initialJavaScript: bytes(initial),
			lazyEntryOnly: bytes(new Set([...initial].filter((key) => !eager.has(key)))),
			deferredJavaScript: bytes(deferred),
			mapLibre: bytes(engine),
			workers,
			passed: true
		},
		null,
		2
	)
);
