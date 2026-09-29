import { error, json } from '@sveltejs/kit';
import { highlight } from '#lib/server/docs/highlight.js';
import type { EntryGenerator, RequestHandler } from './$types';

const sources = import.meta.glob<string>(
	[
		'/src/lib/site/examples/*.svelte',
		'/src/lib/site/previews/*.svelte',
		'/src/lib/site/block-examples/*.svelte',
		'/src/lib/site/guide-examples/*.svelte'
	],
	{ query: '?raw', import: 'default' }
);
export const prerender = true;
export const entries: EntryGenerator = () =>
	Object.keys(sources).map((path) => {
		const [, kind, slug] = path.match(/\/site\/([^/]+)\/([^/]+)\.svelte$/)!;
		return { kind, slug };
	});
export const GET: RequestHandler = async ({ params }) => {
	const load = sources[`/src/lib/site/${params.kind}/${params.slug}.svelte`];
	if (!load) error(404, 'Example source not found');
	const code = await load();
	return json({ code, html: await highlight(code, 'svelte') });
};
