export type Track = {
	id: string;
	title: string;
	artist: string;
	album: string;
	duration: number;
	tone: string;
	accent: string;
};

export type Collection = {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	trackIds: string[];
	tone: string;
	accent: string;
};

export const tracks: Track[] = [
	{
		id: 'soft-static',
		title: 'Soft Static',
		artist: 'Mira Vale',
		album: 'Signals After Dark',
		duration: 234,
		tone: '#813f57',
		accent: '#f1ad85'
	},
	{
		id: 'north-window',
		title: 'North Window',
		artist: 'Mira Vale',
		album: 'Signals After Dark',
		duration: 201,
		tone: '#513954',
		accent: '#d6a0bd'
	},
	{
		id: 'blue-hour',
		title: 'Blue Hour',
		artist: 'Mira Vale',
		album: 'Signals After Dark',
		duration: 268,
		tone: '#263a62',
		accent: '#94b8ee'
	},
	{
		id: 'off-grid',
		title: 'Off Grid',
		artist: 'Nilo Park',
		album: 'Little Machines',
		duration: 193,
		tone: '#355648',
		accent: '#b5d590'
	},
	{
		id: 'slow-current',
		title: 'Slow Current',
		artist: 'June Arcade',
		album: 'Low Tide Club',
		duration: 246,
		tone: '#395a6e',
		accent: '#91d7d0'
	},
	{
		id: 'paper-moon',
		title: 'Paper Moon',
		artist: 'June Arcade',
		album: 'Low Tide Club',
		duration: 218,
		tone: '#62533c',
		accent: '#e7c674'
	},
	{
		id: 'room-tone',
		title: 'Room Tone',
		artist: 'The Common Hours',
		album: 'Close to Home',
		duration: 177,
		tone: '#62463d',
		accent: '#e7a783'
	},
	{
		id: 'green-line',
		title: 'Green Line',
		artist: 'Nilo Park',
		album: 'Little Machines',
		duration: 225,
		tone: '#304b3a',
		accent: '#a7d684'
	},
	{
		id: 'open-late',
		title: 'Open Late',
		artist: 'The Common Hours',
		album: 'Close to Home',
		duration: 252,
		tone: '#573848',
		accent: '#e9a0bc'
	}
];

export const collections: Collection[] = [
	{
		id: 'after-dark',
		title: 'Signals After Dark',
		subtitle: 'Mira Vale · 2026',
		description: 'Patient electronic pop for late trains, dim rooms, and unfinished thoughts.',
		trackIds: ['soft-static', 'north-window', 'blue-hour'],
		tone: '#813f57',
		accent: '#f1ad85'
	},
	{
		id: 'little-machines',
		title: 'Little Machines',
		subtitle: 'Nilo Park · 2025',
		description: 'Warm analogue loops assembled from field recordings and pocket-sized synths.',
		trackIds: ['off-grid', 'green-line', 'slow-current'],
		tone: '#355648',
		accent: '#b5d590'
	},
	{
		id: 'low-tide',
		title: 'Low Tide Club',
		subtitle: 'June Arcade · 2026',
		description: 'Soft-focus guitar music with salt in the air and nowhere urgent to be.',
		trackIds: ['slow-current', 'paper-moon', 'north-window'],
		tone: '#395a6e',
		accent: '#91d7d0'
	},
	{
		id: 'close-home',
		title: 'Close to Home',
		subtitle: 'The Common Hours · 2024',
		description: 'Small-room songs about familiar streets, friends, and the long way back.',
		trackIds: ['room-tone', 'open-late', 'paper-moon'],
		tone: '#62463d',
		accent: '#e7a783'
	}
];

export const initialQueue = [
	'soft-static',
	'north-window',
	'blue-hour',
	'off-grid',
	'slow-current',
	'paper-moon'
];
