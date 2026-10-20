import { error } from '@sveltejs/kit';
import { loadReferencePage } from '#lib/server/docs/reference-page.js';
import { componentGuides } from '#lib/site/component-guides/index.js';
import { components, getComponent } from '#lib/site/registry';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => components.map(({ slug }) => ({ slug }));
export const load: PageServerLoad = async ({ params }) => {
	const component = getComponent(params.slug);
	if (!component) error(404, 'Component not found');
	const guide = componentGuides[params.slug];
	if (!guide) error(500, 'Component guide not found');
	return loadReferencePage(component, guide);
};
