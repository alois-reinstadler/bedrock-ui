import { error } from '@sveltejs/kit';
import { films, findFilm } from '#lib/templates/video-library/catalog.js';
import type { EntryGenerator, PageLoad } from './$types';
export const entries: EntryGenerator = () => films.map((film) => ({ slug: film.slug }));
export const load: PageLoad = ({ params }) => {
	const film = findFilm(params.slug);
	if (!film) error(404, 'Film not found');
	return { film };
};
