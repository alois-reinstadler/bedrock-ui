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
		description:
			'Browse real music by genre, explore albums, and keep listening as you move through your library.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Input'],
		blocks: [],
		thumbnail: '/templates/music-player.png'
	},
	{
		slug: 'video-library',
		title: 'Video Library',
		description:
			'Discover open films, explore title pages, and watch in a dedicated player with saved progress.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Video Player'],
		blocks: [],
		thumbnail: '/templates/video-library.png'
	},
	{
		slug: 'email-client',
		title: 'Email Client',
		description:
			'A unified mail workspace with conversations, calendar, tasks, and follow-ups in one familiar shell.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: [
			'Avatar',
			'Badge',
			'Button',
			'Checkbox',
			'Date Input',
			'Dialog',
			'Dropdown Menu',
			'Icon',
			'Icon Button',
			'Input',
			'Label',
			'Scroll Area',
			'Separator',
			'Textarea'
		],
		blocks: [],
		thumbnail: '/templates/email-client.png'
	},
	{
		slug: 'social-network',
		title: 'Social Network',
		description:
			'A live-feeling timeline with photos, video, replies, reposts, quotes, and community context.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Button', 'Dropdown Menu', 'Input', 'Textarea'],
		blocks: [],
		thumbnail: '/templates/social-network.png'
	}
];
