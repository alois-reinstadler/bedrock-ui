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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/152/1654766391_N6n9kRBaAr_Cartoon---On--On-feat.-Daniel-Levi-_NCS-Release_.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/143/heroes-tonight-feat-johnning-1586946924-fcppiBJp7z.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/287/mortals-feat-laura-brehm-1586948736-3e1Snmxk7T.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/007/my-heart-1586945702-4NfTD6qN1D.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/137/invincible-1586946876-v3qvV3TEKb.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/290/sky-high-1586948785-jGkCsW2xA9.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/003/blank-1586945660-LPD2Fw7OZ0.mp3',
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
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/144/why-we-lose-feat-coleman-trapp-1586946940-Bpv8ccBznf.mp3',
		source: 'https://ncs.io/whywelose',
		youtube: 'https://youtu.be/zyXmsVwZqX4',
		download: 'https://ncs.io/track/download/84a06f66-d649-4224-b3a3-d35857fcf752'
	},
	{
		id: 'royalty',
		title: 'Royalty',
		artist: 'Maestro Chives, Egzod, Neoni',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/royalty.jpg',
		duration: 223.58525,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/936/royalty-1619082033-7RC2AlRdd1.mp3',
		source: 'https://ncs.io/royalty',
		youtube: 'https://ncs.lnk.to/RoyaltyAT/youtube',
		download: 'https://ncs.io/track/download/2b08f7d9-4f5f-47bd-a608-07dec1f7eaa9'
	},
	{
		id: 'fearless',
		title: 'Fearless',
		artist: 'TULE',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/fearless.jpg',
		duration: 194.351,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/396/fearless-1586951971-4hvTByxSmH.mp3',
		source: 'https://ncs.io/fearless',
		youtube: 'https://youtu.be/9rujCfYXhQc',
		download: 'https://ncs.io/track/download/65b8d9a0-5099-4f5c-b0b2-c73c608ce220'
	},
	{
		id: 'dreams',
		title: 'Dreams',
		artist: 'Lost Sky',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/dreams.jpg',
		duration: 215.222857,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/516/dreams-1586955327-tIgsclVBNj.mp3',
		source: 'https://ncs.io/dreams',
		youtube: 'https://youtu.be/SHFTHDncw0g',
		download: 'https://ncs.io/track/download/7f94394e-9d74-4879-84c7-68a573efe153'
	},
	{
		id: 'symbolism',
		title: 'Symbolism',
		artist: 'Electro-Light',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/symbolism.jpg',
		duration: 291.108571,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/093/symbolism-1586946511-TalL4nERHU.mp3',
		source: 'https://ncs.io/symbolism',
		youtube: 'https://youtu.be/__CRWE-L45k',
		download: 'https://ncs.io/track/download/1e1cff69-5635-4b09-99bd-7aa72e2ae6bb'
	},
	{
		id: 'superhero',
		title: 'Superhero (feat. Chris Linton)',
		artist: 'Unknown Brain, Chris Linton',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/superhero.jpg',
		duration: 179.224989,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/278/superhero-feat-chris-linton-1586948509-4NVMcj3ldb.mp3',
		source: 'https://ncs.io/superhero',
		youtube: 'https://youtu.be/LHvYrn3FAgI',
		download: 'https://ncs.io/track/download/56facf61-7e12-46ed-a219-a01eedb08ea6'
	},
	{
		id: 'need-u',
		title: 'Need U',
		artist: 'Lynzz, Arya, borne',
		genre: 'Trap',
		collection: 'after-hours',
		artwork: '/templates/music-player/need-u.jpg',
		duration: 117.446531,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/001/165/need-u-1658224840-xDMN0S6Bfp.mp3',
		source: 'https://ncs.io/needu',
		youtube: 'https://youtu.be/',
		download: 'https://ncs.io/track/download/e5bffb38-d377-420a-9745-4dd182116070'
	},
	{
		id: 'hope',
		title: 'Hope',
		artist: 'Morley, Speo',
		genre: 'Melodic Dubstep',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/hope.jpg',
		duration: 217.077551,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/036/hope-1586945973-XofUJRVQs7.mp3',
		source: 'https://ncs.io/hope',
		youtube: 'https://youtu.be/AUEdtwct0ac',
		download: 'https://ncs.io/track/download/bec4e98c-4760-4f34-bff1-cf8a4cfbda73'
	},
	{
		id: 'nekozilla',
		title: 'Nekozilla',
		artist: 'Different Heaven',
		genre: 'Hardstyle',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/nekozilla.jpg',
		duration: 166.008163,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/275/nekozilla-1586948469-wOdU2Fj3uG.mp3',
		source: 'https://ncs.io/nekozilla',
		youtube: 'https://youtu.be/6FNHe3kf8_s',
		download: 'https://ncs.io/track/download/43bb07ed-a7fa-4f45-88c8-d6388412999f'
	},
	{
		id: 'nostalgia',
		title: 'Nostalgia',
		artist: 'SirensCeol',
		genre: 'House',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/nostalgia.jpg',
		duration: 320.10449,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/111/nostalgia-1586946647-xVBvEsvITG.mp3',
		source: 'https://ncs.io/nostalgia',
		youtube: 'https://youtu.be/geW8xN7grpg',
		download: 'https://ncs.io/track/download/1ade83c7-2719-467f-9861-5419093f55d8'
	},
	{
		id: 'adventure',
		title: 'Adventure',
		artist: 'JJD',
		genre: 'Indie',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/adventure.jpg',
		duration: 297.665306,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/248/adventure-1586947914-NubaubzmyH.mp3',
		source: 'https://ncs.io/adventure',
		youtube: 'https://youtu.be/f2xGxd9xPYA',
		download: 'https://ncs.io/track/download/3a105350-792c-4cc8-bca9-00b3a30320fe'
	},
	{
		id: 'infinite',
		title: 'Infinite',
		artist: 'Valence',
		genre: 'Electronic',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/infinite.jpg',
		duration: 202.13551,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/315/infinite-1586949421-XNCsr8NqkX.mp3',
		source: 'https://ncs.io/infinite',
		youtube: 'https://youtu.be/QHoqD47gQG8',
		download: 'https://ncs.io/track/download/91f9b565-2dca-416f-b1c5-9d57e7087479'
	},
	{
		id: 'horizon',
		title: 'Horizon',
		artist: 'GLNNA, Blosso, Slippy',
		genre: 'Electronic',
		collection: 'slow-mornings',
		artwork: '/templates/music-player/horizon.jpg',
		duration: 200.01955,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/961/horizon-1623423635-1ggDBXu1pj.mp3',
		source: 'https://ncs.io/horizon',
		youtube: 'https://youtu.be/mIrbvjZRE9c',
		download: 'https://ncs.io/track/download/ca453e1c-3c56-488f-854a-d022e46c7ebf'
	},
	{
		id: 'cradles',
		title: 'Cradles',
		artist: 'Sub Urban',
		genre: 'Bass',
		collection: 'the-lounge',
		artwork: '/templates/music-player/cradles.png',
		duration: 209.84165,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/577/cradles-1586957268-RxHgjX9e14.mp3',
		source: 'https://ncs.io/cradles',
		youtube: 'https://youtu.be/Hn4sfC2PbhI',
		download: 'https://ncs.io/track/download/87079052-d78a-4f77-bbdf-b6224d9db645'
	},
	{
		id: 'control',
		title: 'Control (feat. Jex)',
		artist: 'Unknown Brain, Rival, Jex',
		genre: 'Trap',
		collection: 'the-lounge',
		artwork: '/templates/music-player/control.jpg',
		duration: 166.844075,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/545/1704708945_xnHIMQjH93_Unknown-Brain--Rival---Control-ft.-Jex.mp3',
		source: 'https://ncs.io/control',
		youtube: 'https://youtu.be/bLZHcnuqscU',
		download: 'https://ncs.io/track/download/cb017fb7-0620-4853-b9a9-6a067fb1ec45'
	},
	{
		id: 'together',
		title: 'Together',
		artist: '3rd Prototype',
		genre: 'Electronic',
		collection: 'the-lounge',
		artwork: '/templates/music-player/together.jpg',
		duration: 190.432653,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/336/together-1586949970-ab45Hdgg2d.mp3',
		source: 'https://ncs.io/together',
		youtube: 'https://youtu.be/1nPLftxnkts',
		download: 'https://ncs.io/track/download/87d25199-1d78-4d3d-9fb4-67ff43325402'
	},
	{
		id: 'perfect-10-vip',
		title: 'Perfect 10 (Unknown Brain & RudeLies VIP)',
		artist: 'Unknown Brain, Heather Sommer, RudeLies',
		genre: 'House',
		collection: 'the-lounge',
		artwork: '/templates/music-player/perfect-10-vip.jpg',
		duration: 204.04245,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/621/perfect-10-unknown-brain-rudelies-vip-1586958206-ePlpeomqS2.mp3',
		source: 'https://ncs.io/perfect10',
		youtube: 'https://youtu.be/xahgjUd9nx4',
		download: 'https://ncs.io/track/download/2327b3a9-eab8-457a-b156-0fdde743c955'
	},
	{
		id: 'we-are',
		title: 'We Are',
		artist: 'Kisma',
		genre: 'House',
		collection: 'the-lounge',
		artwork: '/templates/music-player/we-are.jpg',
		duration: 276.244898,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/412/we-are-1586952495-7uLrIn2Qlg.mp3',
		source: 'https://ncs.io/weare',
		youtube: 'https://youtu.be/WfluodjOkOk',
		download: 'https://ncs.io/track/download/c45f73ee-1179-4c00-884e-335d504c68cd'
	},
	{
		id: 'chasing-dreams',
		title: 'Chasing Dreams',
		artist: 'Jim Yosef, Valentina Franco',
		genre: 'Electronic',
		collection: 'the-lounge',
		artwork: '/templates/music-player/chasing-dreams.jpg',
		duration: 207.36,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/570/chasing-dreams-1586957034-4Zgb5WQMHI.mp3',
		source: 'https://ncs.io/ChasingDreams',
		youtube: 'https://youtu.be/WkWY9ctNr0I',
		download: 'https://ncs.io/track/download/42426bf3-62e6-4530-b310-e0b111b5431f'
	},
	{
		id: 'feel-good',
		title: 'Feel Good',
		artist: 'Syn Cole',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/feel-good.jpg',
		duration: 181.8419,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/205/1754048435_cSGiPs4mj9_Syn-Cole---Feel-Good.mp3',
		source: 'https://ncs.io/feelgood',
		youtube: 'https://youtu.be/q1ULJ92aldE',
		download: 'https://ncs.io/track/download/be608f27-74a5-4785-9a7d-192fdaf0dd4e'
	},
	{
		id: 'shine',
		title: 'Shine',
		artist: 'Spektrem',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/shine.jpg',
		duration: 259.082449,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/004/shine-1586945670-Quaaj2gT6A.mp3',
		source: 'https://ncs.io/shine',
		youtube: 'https://youtu.be/n4tK7LYFxI0',
		download: 'https://ncs.io/track/download/ba50e6b1-19de-4b9a-9c91-d63a3fa105cb'
	},
	{
		id: 'link',
		title: 'Link',
		artist: 'Jim Yosef',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/link.jpg',
		duration: 224.444075,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/356/link-1586950573-1rqR7whieT.mp3',
		source: 'https://ncs.io/link',
		youtube: 'https://youtu.be/9iHM6X6uUH8',
		download: 'https://ncs.io/track/download/fec6a5e4-241c-40dd-88a1-53e71025661b'
	},
	{
		id: 'energy',
		title: 'Energy',
		artist: 'Elektronomia',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/energy.jpg',
		duration: 198.791837,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/250/1723199686_A0jye1QGXf_Elektronomia---Energy.mp3',
		source: 'https://ncs.io/energy',
		youtube: 'https://youtu.be/fzNMd3Tu1Zw',
		download: 'https://ncs.io/track/download/4265e03a-2bd7-46a5-9817-5750d922ca32'
	},
	{
		id: 'destiny',
		title: 'Destiny',
		artist: 'Tobu, DEAF KEV, Anna Yvette, Electro-Light, Jim Yosef',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/destiny.jpg',
		duration: 221.2571,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/995/destiny-1629208835-btbIDZHj2V.mp3',
		source: 'https://ncs.io/destiny',
		youtube: 'https://youtu.be/-mMmOKHzuWc',
		download: 'https://ncs.io/track/download/ae3edfb0-3ac9-4eb7-8886-46daf164cd16'
	},
	{
		id: 'entropy',
		title: 'Entropy',
		artist: 'Distrion, Alex Skrindo',
		genre: 'House',
		collection: 'sunday-drive',
		artwork: '/templates/music-player/entropy.jpg',
		duration: 196.04898,
		audio:
			'https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/162/entropy-1586947085-nMePSh9jHT.mp3',
		source: 'https://ncs.io/entropy',
		youtube: 'https://youtu.be/iaKgF1Vf5bQ',
		download: 'https://ncs.io/track/download/e9af8f9f-2560-4c60-98d8-1192012fdcb4'
	}
];
export const collections: Collection[] = [
	{
		id: 'after-hours',
		title: 'Bass Anthems',
		genre: 'Trap & dubstep',
		description: 'Heavy drops, soaring vocals, and festival-sized trap and dubstep anthems.',
		artwork: '/templates/music-player/mortals.jpg',
		trackIds: [
			'mortals',
			'invincible',
			'royalty',
			'fearless',
			'dreams',
			'symbolism',
			'superhero',
			'need-u'
		]
	},
	{
		id: 'slow-mornings',
		title: 'Melodic Rush',
		genre: 'Melodic bass',
		description: 'Bright melodies, soaring synths, and a rush of drumstep and melodic bass.',
		artwork: '/templates/music-player/my-heart.jpg',
		trackIds: [
			'my-heart',
			'blank',
			'hope',
			'nekozilla',
			'nostalgia',
			'adventure',
			'infinite',
			'horizon'
		]
	},
	{
		id: 'the-lounge',
		title: 'Vocal Classics',
		genre: 'Electronic & DnB',
		description: 'Unforgettable voices and sing-along hooks, from Cartoon and Jéja to Sub Urban.',
		artwork: '/templates/music-player/on-and-on.jpg',
		trackIds: [
			'on-and-on',
			'why-we-lose',
			'cradles',
			'control',
			'together',
			'perfect-10-vip',
			'we-are',
			'chasing-dreams'
		]
	},
	{
		id: 'sunday-drive',
		title: 'House Classics',
		genre: 'House',
		description: 'Hands-up melodies from Janji, Elektronomia, Syn Cole, Jim Yosef, and friends.',
		artwork: '/templates/music-player/heroes-tonight.jpg',
		trackIds: [
			'heroes-tonight',
			'sky-high',
			'feel-good',
			'shine',
			'link',
			'energy',
			'destiny',
			'entropy'
		]
	}
];
export const genres = [...new Set(tracks.map((track) => track.genre))];
export function formatTime(seconds: number) {
	const value = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
	return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
