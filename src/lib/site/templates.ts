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
		components: ['Avatar', 'Badge', 'Button', 'Icon', 'Icon Button', 'Input', 'Scroll Area'],
		blocks: [],
		thumbnail: '/templates/music-player.png'
	},
	{
		slug: 'video-library',
		title: 'Video Library',
		description:
			'Discover fictional films, build a watchlist, and explore a focused viewing surface.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: [
			'Avatar',
			'Badge',
			'Button',
			'Dialog',
			'Heading',
			'Icon',
			'Icon Button',
			'Input',
			'Scroll Area',
			'Text',
			'Video Player'
		],
		blocks: [],
		thumbnail: '/templates/video-library.png'
	},
	{
		slug: 'email-client',
		title: 'Email Client',
		description: 'A calm inbox with folders, message reading, composition, and calendar context.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: [
			'Avatar',
			'Badge',
			'Button',
			'Checkbox',
			'Dialog',
			'Dropdown Menu',
			'Icon',
			'Icon Button',
			'Input',
			'Input Group',
			'Label',
			'Scroll Area',
			'Separator',
			'Sheet',
			'Textarea'
		],
		blocks: [],
		thumbnail: '/templates/email-client.png'
	},
	{
		slug: 'social-network',
		title: 'Social Network',
		description: 'A community workspace for conversations, profiles, reactions, and notifications.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: [
			'Avatar',
			'Badge',
			'Button',
			'Card',
			'Icon Button',
			'Input',
			'Scroll Area',
			'Separator',
			'Sheet',
			'Textarea'
		],
		blocks: [],
		thumbnail: '/templates/social-network.png'
	}
];
