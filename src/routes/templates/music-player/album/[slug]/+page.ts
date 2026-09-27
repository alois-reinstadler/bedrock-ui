import { error } from '@sveltejs/kit';
import { collections } from '#lib/templates/music-player/data.js';
import type { PageLoad, EntryGenerator } from './$types';
export const entries: EntryGenerator = () =>
	collections.map((collection) => ({ slug: collection.id }));
export const load: PageLoad = ({ params }) => {
	const collection = collections.find((item) => item.id === params.slug);
	if (!collection) error(404, 'Collection not found');
	return { collection };
};
