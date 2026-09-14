import { getComponentReference } from '#lib/server/component-reference/index.js';
import { error } from '@sveltejs/kit';
import { componentGuides } from '#lib/site/component-guides/index.js';
import { components, getComponent } from '#lib/site/registry';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	components.map((component) => ({ slug: component.slug }));

export const load: PageServerLoad = ({ params }) => {
	const component = getComponent(params.slug);
	if (!component) error(404, 'Component not found');
	const guide = componentGuides[params.slug];
	if (!guide) error(500, 'Component guide not found');
	return { component, guide, reference: getComponentReference(component.slug, component.category) };
};
