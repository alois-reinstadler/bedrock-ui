export type Track = {
	id: string;
	title: string;
	artist: string;
	genre: string;
	collection: string;
	artwork: string;
	duration: number;
	audio: string;
	source: string;
	youtube: string;
	download: string;
	isrc?: string;
};
export type Collection = {
	id: string;
	title: string;
	genre: string;
	description: string;
	artwork: string;
	trackIds: string[];
};
export const tracks: Track[] = [
	{
		id: 'on-and-on',
		title: 'On & On',
		artist: 'Cartoon, Jéja feat. Daniel Levi',
		genre: 'Electronic',
		collection: 'the-lounge',
		artwork: '/templates/music-player/on-and-on.jpg',
		duration: 208.013061,
		audio: '/templates/music-player/on-and-on.mp3',
		source: 'https://ncs.io/onandon',
		youtube: 'https://youtu.be/K4DyBUG242c',
		download: 'https://ncs.io/track/download/442dfd89-c291-41b4-b93a-18c0ff73c1dc'
	},
	{
		id: 'heroes-tonight',
		title: 'Heroes Tonight',
		artist: 'Janji feat. Johnning',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/heroes-tonight.jpg',
		duration: 208.091429,
		audio: '/templates/music-player/heroes-tonight.mp3',
		source: 'https://ncs.io/ht',
		youtube: 'https://youtu.be/3nQNiWdeH2Q',
		download: 'https://ncs.io/track/download/2ede9de2-8386-4210-b2a0-b36d731c8a4e'
	},
	{
		id: 'mortals',
		title: 'Mortals',
		artist: 'Warriyo feat. Laura Brehm',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/mortals.jpg',
		duration: 228.388571,
		audio: '/templates/music-player/mortals.mp3',
		source: 'https://ncs.io/mortals',
		youtube: 'https://youtu.be/yJg-Y5byMMw',
		download: 'https://ncs.io/track/download/784a2ccc-5ace-48d1-8af1-9da55c383960'
	},
	{
		id: 'my-heart',
		title: 'My Heart',
		artist: 'Different Heaven & EH!DE',
		genre: 'Drumstep',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/my-heart.jpg',
		duration: 267.102041,
		audio: '/templates/music-player/my-heart.mp3',
		source: 'https://ncs.io/myheart',
		youtube: 'https://youtu.be/jK2aIUmmdP4',
		download: 'https://ncs.io/track/download/db1bcfe4-1999-4b5e-879c-2d21b3456285'
	},
	{
		id: 'invincible',
		title: 'Invincible',
		artist: 'DEAF KEV',
		genre: 'Melodic Dubstep',
		collection: 'after-hours',
		artwork: '/templates/music-player/invincible.jpg',
		duration: 273.084082,
		audio: '/templates/music-player/invincible.mp3',
		source: 'https://ncs.io/invincible',
		youtube: 'https://youtu.be/J2X5mJ3HDYE',
		download: 'https://ncs.io/track/download/817ec1ef-bac0-4c8a-9671-857fdd13cfa9'
	},
	{
		id: 'sky-high',
		title: 'Sky High',
		artist: 'Elektronomia',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/sky-high.jpg',
		duration: 236.303675,
		audio: '/templates/music-player/sky-high.mp3',
		source: 'https://ncs.io/skyhigh',
		youtube: 'https://youtu.be/TW9d8vYrVFQ',
		download: 'https://ncs.io/track/download/6d744632-0472-463c-8a13-da071971fbdf'
	},
	{
		id: 'blank',
		title: 'Blank',
		artist: 'Disfigure',
		genre: 'Melodic Dubstep',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/blank.jpg',
		duration: 209.057959,
		audio: '/templates/music-player/blank.mp3',
		source: 'https://ncs.io/blank',
		youtube: 'https://youtu.be/p7ZsBPK656s',
		download: 'https://ncs.io/track/download/0d434c0f-8059-42af-bae6-61b7aa0e294b'
	},
	{
		id: 'why-we-lose',
		title: 'Why We Lose',
		artist: 'Cartoon, Jéja feat. Coleman Trapp',
		genre: 'Drum & Bass',
		collection: 'the-lounge',
		artwork: '/templates/music-player/why-we-lose.jpg',
		duration: 213.054694,
		audio: '/templates/music-player/why-we-lose.mp3',
		source: 'https://ncs.io/whywelose',
		youtube: 'https://youtu.be/zyXmsVwZqX4',
		download: 'https://ncs.io/track/download/84a06f66-d649-4224-b3a3-d35857fcf752'
	}
];
export const collections: Collection[] = [
	{
		id: 'after-hours',
		title: 'Bass Anthems',
		genre: 'Trap & dubstep',
		description: 'Heavy drops, soaring vocals, and two unmistakable NCS classics.',
		artwork: '/templates/music-player/mortals.jpg',
		trackIds: ['mortals', 'invincible']
	},
	{
		id: 'slow-mornings',
		title: 'Melodic Rush',
		genre: 'Melodic bass',
		description: 'Bright melodies meet drumstep energy and soaring dubstep.',
		artwork: '/templates/music-player/my-heart.jpg',
		trackIds: ['my-heart', 'blank']
	},
	{
		id: 'the-lounge',
		title: 'Vocal Classics',
		genre: 'Electronic & DnB',
		description: 'Cartoon and Jéja: unforgettable vocals, from pop hooks to drum & bass.',
		artwork: '/templates/music-player/on-and-on.jpg',
		trackIds: ['on-and-on', 'why-we-lose']
	},
	{
		id: 'sunday-drive',
		title: 'House Classics',
		genre: 'House',
		description: 'Hands-up melodies and euphoric drops from Janji and Elektronomia.',
		artwork: '/templates/music-player/heroes-tonight.jpg',
		trackIds: ['heroes-tonight', 'sky-high']
	}
];
export const genres = [...new Set(tracks.map((track) => track.genre))];
export function formatTime(seconds: number) {
	const value = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
	return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
