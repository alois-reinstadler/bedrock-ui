export type TemplateSlug = 'music-player' | 'video-library' | 'email-client' | 'social-network';

export type TemplateDoc = {
	slug: TemplateSlug;
	title: string;
	description: string;
	layouts: string[];
	components: string[];
	blocks: string[];
	thumbnail: string;
};

export const templates: TemplateDoc[] = [
	{
		slug: 'music-player',
		title: 'Music Player',
		description: 'A listening workspace with collections, a queue, and compact playback controls.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Input', 'Scroll Area', 'Avatar', 'Slider'],
		blocks: [],
		thumbnail: '/templates/music-player.webp'
	},
	{
		slug: 'video-library',
		title: 'Video Library',
		description:
			'Discover fictional films, build a watchlist, and explore a focused viewing surface.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Dialog', 'Badge'],
		blocks: [],
		thumbnail: '/templates/video-library.webp'
	},
	{
		slug: 'email-client',
		title: 'Email Client',
		description: 'A calm inbox with folders, message reading, composition, and calendar context.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Input', 'Avatar'],
		blocks: [],
		thumbnail: '/templates/email-client.webp'
	},
	{
		slug: 'social-network',
		title: 'Social Network',
		description: 'A community workspace for conversations, profiles, reactions, and notifications.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Avatar', 'Textarea'],
		blocks: [],
		thumbnail: '/templates/social-network.webp'
	}
];
