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
			'Play nine original songs, build your library, and shape the queue with a responsive full player.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: ['Avatar', 'Badge', 'Button', 'Icon', 'Icon Button', 'Input', 'Scroll Area'],
		blocks: [],
		thumbnail: '/templates/music-player.png'
	},
	{
		slug: 'video-library',
		title: 'Video Library',
		description:
			'Watch original short films, explore genres, and pick up where you left off with saved playback.',
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
		description:
			'Mail, Calendar, and Tasks in one workspace, with inline composition and message follow-ups.',
		layouts: ['Mobile', 'Tablet', 'Desktop'],
		components: [
			'Avatar',
			'Badge',
			'Button',
			'Checkbox',
			'Calendar',
			'Date Input',
			'Dialog',
			'Dropdown Menu',
			'Icon',
			'Icon Button',
			'Input',
			'Input Group',
			'Label',
			'Progress',
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
		description:
			'Share described media, explore circles, edit profiles, and keep up with conversations and updates.',
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
