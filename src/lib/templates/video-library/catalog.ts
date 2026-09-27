export const base = '/templates/video-library';
export type Film = {
	slug: string;
	title: string;
	year: number;
	duration: number;
	genres: string[];
	kind: 'Short film' | 'Trailer';
	director: string;
	description: string;
	tagline: string;
	credit: string;
	website: string;
	license: string;
	licenseUrl: string;
};
export const films: Film[] = [
	{
		slug: 'tears-of-steel',
		title: 'Tears of Steel',
		year: 2012,
		duration: 734,
		genres: ['Science fiction', 'Action'],
		kind: 'Short film',
		director: 'Ian Hubert',
		tagline: 'The past is our last hope.',
		description:
			'In a future Amsterdam, a small team of scientists and soldiers tries to recreate a memory. The fate of the world depends on getting one moment right.',
		credit: 'Blender Foundation / mango.blender.org',
		website: 'https://mango.blender.org/about/',
		license: 'CC BY 3.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/3.0/'
	},
	{
		slug: 'caminandes',
		title: 'Caminandes: Gran Dillama',
		year: 2013,
		duration: 146,
		genres: ['Animation', 'Comedy'],
		kind: 'Short film',
		director: 'Pablo Vazquez',
		tagline: 'The grass is always greener.',
		description:
			'Koro has his eye on the perfect lunch. There is just one small problem: an electric fence. A wordless Patagonian adventure with a very determined llama.',
		credit: 'Pablo Vazquez, Beorn Leonard, Francesco Siddi / caminandes.com',
		website: 'https://www.caminandes.com/',
		license: 'CC BY-SA 3.0',
		licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
	},
	{
		slug: 'big-buck-bunny',
		title: 'Big Buck Bunny',
		year: 2008,
		duration: 596,
		genres: ['Animation', 'Comedy'],
		kind: 'Short film',
		director: 'Sacha Goedegebure',
		tagline: 'A little kindness. A big comeback.',
		description:
			'A gentle giant’s peaceful day takes a turn when three woodland troublemakers push him too far. A sunny, mischievous animated short from the Blender Foundation.',
		credit: 'Blender Foundation / www.bigbuckbunny.org',
		website: 'https://peach.blender.org/about/',
		license: 'CC BY 3.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/3.0/'
	},
	{
		slug: 'sintel',
		title: 'Sintel',
		year: 2010,
		duration: 52,
		genres: ['Fantasy', 'Animation'],
		kind: 'Trailer',
		director: 'Colin Levy',
		tagline: 'Some journeys change everything.',
		description:
			'A young traveler crosses an unforgiving world in search of a lost friend. The official trailer for Blender’s open fantasy film.',
		credit: 'Blender Foundation / www.sintel.org',
		website: 'https://durian.blender.org/sharing/',
		license: 'CC BY 3.0',
		licenseUrl: 'https://creativecommons.org/licenses/by/3.0/'
	}
];
export const genres = ['Science fiction', 'Animation', 'Comedy', 'Fantasy'];
export const genreSlug = (genre: string) => genre.toLowerCase().replaceAll(' ', '-');
export const poster = (film: Film) => `${base}/${film.slug}.jpg`;
export const source = (film: Film) => `${base}/${film.slug}.mp4`;
export const runtime = (film: Film) =>
	`${Math.floor(film.duration / 60)}:${String(Math.round(film.duration % 60)).padStart(2, '0')}`;
export const findFilm = (slug: string) => films.find((film) => film.slug === slug);
