import { error } from '@sveltejs/kit';
import { genres, genreSlug, films } from '#lib/templates/video-library/catalog.js';
import type { EntryGenerator, PageLoad } from './$types';
export const entries: EntryGenerator = () =>
	[...genres, 'Action'].map((genre) => ({ genre: genreSlug(genre) }));
export const load: PageLoad = ({ params }) => {
	const genre = [...genres, 'Action'].find((item) => genreSlug(item) === params.genre);
	if (!genre) error(404, 'Genre not found');
	return { genre, films: films.filter((film) => film.genres.includes(genre)) };
};
