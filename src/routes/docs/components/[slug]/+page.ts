import { error } from '@sveltejs/kit';
import { components, getComponent } from '#lib/site/registry';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => components.map((component) => ({ slug: component.slug }));

export const load: PageLoad = ({ params }) => {
	const component = getComponent(params.slug);
	if (!component) error(404, 'Component not found');
	return { component };
};
