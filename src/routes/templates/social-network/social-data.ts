export type Person = {
	id: string;
	name: string;
	handle: string;
	initials: string;
	role: string;
	tone: string;
	mutuals?: number;
};

export type Reply = {
	id: string;
	author: Person;
	time: string;
	content: string;
	likes: number;
};

export type FeedPost = {
	id: string;
	author: Person;
	time: string;
	content: string;
	topic?: string;
	likes: number;
	reposts: number;
	views: string;
	liked?: boolean;
	reposted?: boolean;
	bookmarked?: boolean;
	image?: {
		alt: string;
		caption: string;
		tone: string;
	};
	replies: Reply[];
};

export const people = {
	mina: {
		id: 'mina',
		name: 'Mina Okafor',
		handle: '@mina.makes',
		initials: 'MO',
		role: 'Product designer',
		tone: 'from-amber-200 to-orange-400 dark:from-amber-700 dark:to-orange-950'
	},
	eli: {
		id: 'eli',
		name: 'Eli Moreno',
		handle: '@eli.builds',
		initials: 'EM',
		role: 'Creative developer',
		tone: 'from-cyan-200 to-blue-400 dark:from-cyan-800 dark:to-blue-950',
		mutuals: 12
	},
	sora: {
		id: 'sora',
		name: 'Sora Bell',
		handle: '@sora.fieldnotes',
		initials: 'SB',
		role: 'Urban ecologist',
		tone: 'from-lime-200 to-emerald-400 dark:from-lime-800 dark:to-emerald-950',
		mutuals: 8
	},
	noah: {
		id: 'noah',
		name: 'Noah Kim',
		handle: '@noah.listens',
		initials: 'NK',
		role: 'Sound artist',
		tone: 'from-violet-200 to-fuchsia-400 dark:from-violet-800 dark:to-fuchsia-950',
		mutuals: 21
	},
	rhea: {
		id: 'rhea',
		name: 'Rhea Das',
		handle: '@rhea.works',
		initials: 'RD',
		role: 'Independent publisher',
		tone: 'from-rose-200 to-red-400 dark:from-rose-800 dark:to-red-950',
		mutuals: 5
	}
} satisfies Record<string, Person>;

export const initialPosts: FeedPost[] = [
	{
		id: 'garden-signals',
		author: people.sora,
		time: '18 min',
		topic: 'Field notes',
		content:
			'We mapped shade at three neighborhood gardens today. The surprise was not where plants grew fastest, but where people stopped to talk. Designing for rest changed the whole map.',
		likes: 84,
		reposts: 19,
		views: '3.2k',
		image: {
			alt: 'Abstract map of garden paths and shaded gathering areas',
			caption: 'A field map from today’s walk',
			tone: 'from-emerald-100 via-lime-50 to-amber-100 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950'
		},
		replies: [
			{
				id: 'garden-reply-1',
				author: people.mina,
				time: '9 min',
				content: 'The social layer is the real infrastructure. Would love to see the map legend.',
				likes: 11
			},
			{
				id: 'garden-reply-2',
				author: people.eli,
				time: '4 min',
				content: 'This feels like a useful input for planning public seating, too.',
				likes: 6
			}
		]
	},
	{
		id: 'small-software',
		author: people.eli,
		time: '42 min',
		topic: 'Making software',
		content:
			'A small interface detail I keep returning to: show the consequence beside the choice. Less remembering, fewer surprises, and usually less copy overall.',
		likes: 129,
		reposts: 34,
		views: '7.8k',
		liked: true,
		replies: [
			{
				id: 'software-reply-1',
				author: people.rhea,
				time: '28 min',
				content:
					'This applies to editorial tools too. Preview the result where the decision happens.',
				likes: 18
			}
		]
	},
	{
		id: 'listening-room',
		author: people.noah,
		time: '1 hr',
		topic: 'Studio log',
		content:
			'Tonight’s listening room is built from field recordings made within one city block. Doors at seven; the first set starts when the room settles.',
		likes: 57,
		reposts: 8,
		views: '1.9k',
		bookmarked: true,
		replies: []
	},
	{
		id: 'margin-notes',
		author: people.rhea,
		time: '3 hr',
		topic: 'Independent publishing',
		content:
			'Issue twelve is finally at the printer. It is about useful margins: the physical ones around a page and the temporal ones around a working day.',
		likes: 203,
		reposts: 47,
		views: '12k',
		replies: []
	}
];

export const notifications = [
	{
		id: 'n1',
		person: people.eli,
		message: 'replied to your note about humane defaults.',
		time: '5 min',
		unread: true
	},
	{
		id: 'n2',
		person: people.sora,
		message: 'invited you to follow the Field notes circle.',
		time: '36 min',
		unread: true
	},
	{
		id: 'n3',
		person: people.noah,
		message: 'appreciated your collection “Slow interfaces”.',
		time: '2 hr',
		unread: false
	}
];

export const topics = [
	{ label: 'Calm technology', posts: '1.8k notes' },
	{ label: 'City fieldwork', posts: '684 notes' },
	{ label: 'Independent publishing', posts: '426 notes' }
];

export const suggestions = [people.eli, people.sora, people.noah];
