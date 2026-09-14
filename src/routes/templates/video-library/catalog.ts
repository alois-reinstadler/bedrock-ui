export type PosterTone = 'ember' | 'tide' | 'violet' | 'moss' | 'solar' | 'slate';

export type VideoItem = {
	id: string;
	title: string;
	tagline: string;
	description: string;
	year: number;
	rating: string;
	duration: string;
	genres: string[];
	tone: PosterTone;
	mark: string;
	featured?: boolean;
};

export const catalogue: VideoItem[] = [
	{
		id: 'signal-above',
		title: 'Signal Above',
		tagline: 'Some messages arrive before they are sent.',
		description:
			'A quiet radio astronomer traces an impossible transmission across three observatories and one disappearing coastline.',
		year: 2026,
		rating: '13+',
		duration: '1h 48m',
		genres: ['Science fiction', 'Mystery'],
		tone: 'tide',
		mark: 'SA',
		featured: true
	},
	{
		id: 'after-the-rainline',
		title: 'After the Rainline',
		tagline: 'A city replants itself.',
		description:
			'Five neighbors turn an abandoned train platform into a garden while the city changes around them.',
		year: 2025,
		rating: 'All ages',
		duration: '54m',
		genres: ['Documentary'],
		tone: 'moss',
		mark: 'AR'
	},
	{
		id: 'parallel-lines',
		title: 'Parallel Lines',
		tagline: 'Two trains. One decision.',
		description:
			'A conductor and a cartographer cross the same country on opposite schedules, leaving clues for each other.',
		year: 2026,
		rating: '13+',
		duration: '2h 02m',
		genres: ['Drama', 'Romance'],
		tone: 'ember',
		mark: 'PL'
	},
	{
		id: 'small-hours',
		title: 'Small Hours',
		tagline: 'The night shift knows everything.',
		description:
			'Three overnight workers solve the gentle mysteries their sleeping neighborhood leaves behind.',
		year: 2024,
		rating: '7+',
		duration: '8 episodes',
		genres: ['Comedy', 'Drama'],
		tone: 'violet',
		mark: 'SH'
	},
	{
		id: 'north-by-morning',
		title: 'North by Morning',
		tagline: 'A winter road, without a map.',
		description:
			'Two siblings inherit a delivery route through the far north and discover why their father never missed a stop.',
		year: 2025,
		rating: '13+',
		duration: '1h 36m',
		genres: ['Adventure'],
		tone: 'slate',
		mark: 'NM'
	},
	{
		id: 'field-notes',
		title: 'Field Notes',
		tagline: 'Look closer. Stay longer.',
		description: 'A patient tour of the tiny systems that keep six threatened landscapes alive.',
		year: 2026,
		rating: 'All ages',
		duration: '6 episodes',
		genres: ['Nature', 'Documentary'],
		tone: 'solar',
		mark: 'FN'
	},
	{
		id: 'borrowed-light',
		title: 'Borrowed Light',
		tagline: 'Every photograph keeps a secret.',
		description:
			'An apprentice archivist uncovers a family history hidden in the reflections of a century-old photo collection.',
		year: 2023,
		rating: '13+',
		duration: '1h 42m',
		genres: ['Mystery', 'Drama'],
		tone: 'solar',
		mark: 'BL'
	},
	{
		id: 'last-station',
		title: 'Last Station',
		tagline: 'The final train is never empty.',
		description:
			'A station keeper interviews seven travelers after a storm closes the only line out of town.',
		year: 2025,
		rating: '16+',
		duration: '5 episodes',
		genres: ['Thriller'],
		tone: 'ember',
		mark: 'LS'
	},
	{
		id: 'paper-suns',
		title: 'Paper Suns',
		tagline: 'Make your own weather.',
		description:
			'A young inventor enters a floating lantern race with a machine built from scraps and stubborn optimism.',
		year: 2026,
		rating: 'All ages',
		duration: '1h 24m',
		genres: ['Animation', 'Family'],
		tone: 'violet',
		mark: 'PS'
	},
	{
		id: 'open-water',
		title: 'Open Water',
		tagline: 'The long way around.',
		description:
			'Four ocean researchers document a migration route no satellite has ever fully captured.',
		year: 2024,
		rating: '7+',
		duration: '4 episodes',
		genres: ['Nature', 'Documentary'],
		tone: 'tide',
		mark: 'OW'
	}
];

export const rails = [
	{
		title: 'Continue watching',
		ids: ['small-hours', 'parallel-lines', 'field-notes', 'last-station']
	},
	{
		title: 'Stories worth staying for',
		ids: ['after-the-rainline', 'borrowed-light', 'north-by-morning', 'paper-suns', 'signal-above']
	},
	{
		title: 'Quietly thrilling',
		ids: ['last-station', 'signal-above', 'parallel-lines', 'open-water']
	},
	{
		title: 'Documentaries for a slow Sunday',
		ids: ['field-notes', 'open-water', 'after-the-rainline', 'borrowed-light']
	}
] as const;

export const featured = catalogue.find((item) => item.featured) ?? catalogue[0];

export function findVideo(id: string): VideoItem {
	return catalogue.find((item) => item.id === id) ?? featured;
}
