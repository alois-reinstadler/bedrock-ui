export type Track = {
	id: string;
	title: string;
	artist: string;
	album: string;
	duration: number;
	audio: string;
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
		duration: 34.0,
		audio: '/templates/music-player/soft-static.mp3',
		tone: '#813f57',
		accent: '#f1ad85'
	},
	{
		id: 'north-window',
		title: 'North Window',
		artist: 'Mira Vale',
		album: 'Signals After Dark',
		duration: 36.286,
		audio: '/templates/music-player/north-window.mp3',
		tone: '#513954',
		accent: '#d6a0bd'
	},
	{
		id: 'blue-hour',
		title: 'Blue Hour',
		artist: 'Mira Vale',
		album: 'Signals After Dark',
		duration: 32.0,
		audio: '/templates/music-player/blue-hour.mp3',
		tone: '#263a62',
		accent: '#94b8ee'
	},
	{
		id: 'off-grid',
		title: 'Off Grid',
		artist: 'Nilo Park',
		album: 'Little Machines',
		duration: 30.8,
		audio: '/templates/music-player/off-grid.mp3',
		tone: '#355648',
		accent: '#b5d590'
	},
	{
		id: 'slow-current',
		title: 'Slow Current',
		artist: 'June Arcade',
		album: 'Low Tide Club',
		duration: 36.286,
		audio: '/templates/music-player/slow-current.mp3',
		tone: '#395a6e',
		accent: '#91d7d0'
	},
	{
		id: 'paper-moon',
		title: 'Paper Moon',
		artist: 'June Arcade',
		album: 'Low Tide Club',
		duration: 33.304,
		audio: '/templates/music-player/paper-moon.mp3',
		tone: '#62533c',
		accent: '#e7c674'
	},
	{
		id: 'room-tone',
		title: 'Room Tone',
		artist: 'The Common Hours',
		album: 'Close to Home',
		duration: 34.727,
		audio: '/templates/music-player/room-tone.mp3',
		tone: '#62463d',
		accent: '#e7a783'
	},
	{
		id: 'green-line',
		title: 'Green Line',
		artist: 'Nilo Park',
		album: 'Little Machines',
		duration: 32.0,
		audio: '/templates/music-player/green-line.mp3',
		tone: '#304b3a',
		accent: '#a7d684'
	},
	{
		id: 'open-late',
		title: 'Open Late',
		artist: 'The Common Hours',
		album: 'Close to Home',
		duration: 35.488,
		audio: '/templates/music-player/open-late.mp3',
		tone: '#573848',
		accent: '#e9a0bc'
	}
];

export const collections: Collection[] = [
	{
		id: 'after-dark',
		title: 'Signals After Dark',
		subtitle: 'Mira Vale · 2026',
		description:
			'Three original instrumental sketches: soft keys, suspended chords, and unhurried rhythms.',
		trackIds: ['soft-static', 'north-window', 'blue-hour'],
		tone: '#813f57',
		accent: '#f1ad85'
	},
	{
		id: 'little-machines',
		title: 'Little Machines',
		subtitle: 'Nilo Park · 2025',
		description:
			'Bright original synth sketches built from plucked tones, warm bass, and small rhythmic details.',
		trackIds: ['off-grid', 'green-line', 'slow-current'],
		tone: '#355648',
		accent: '#b5d590'
	},
	{
		id: 'low-tide',
		title: 'Low Tide Club',
		subtitle: 'June Arcade · 2026',
		description:
			'Airy instrumental sketches with bell-like melodies, warm chords, and nowhere urgent to be.',
		trackIds: ['slow-current', 'paper-moon', 'north-window'],
		tone: '#395a6e',
		accent: '#91d7d0'
	},
	{
		id: 'close-home',
		title: 'Close to Home',
		subtitle: 'The Common Hours · 2024',
		description:
			'Quiet original instrumentals for familiar streets, close friends, and the long way back.',
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
