import { error } from '@sveltejs/kit';
import { loadReferencePage } from '#lib/server/docs/reference-page.js';
import { tools, getTool, toolHref } from '#lib/site/tools.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tools.map(({ slug }) => ({ slug }));
export const load: PageServerLoad = async ({ params }) => {
	const tool = getTool(params.slug);
	if (!tool) error(404, 'Tool not found');
	return loadReferencePage(tool.component, tool.guide, toolHref(tool), 'Tools');
};
