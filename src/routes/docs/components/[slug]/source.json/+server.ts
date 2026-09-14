import { error, json } from '@sveltejs/kit';
import { highlight } from '#lib/server/docs/highlight.js';
import { components, getComponent } from '#lib/site/registry';
import type { EntryGenerator, RequestHandler } from './$types';

const sources = import.meta.glob<string>('/src/lib/site/examples/*.svelte', {
	query: '?raw',
	import: 'default'
});
export const prerender = true;
export const entries: EntryGenerator = () => components.map(({ slug }) => ({ slug }));
export const GET: RequestHandler = async ({ params }) => {
	if (!getComponent(params.slug)) error(404, 'Component not found');
	const load = sources[`/src/lib/site/examples/${params.slug}.svelte`];
	if (!load) error(404, 'Example source not found');
	const code = await load();
	return json({ code, html: await highlight(code, 'svelte') });
};
