export const base = '/templates/social-network';
export type Person = {
	handle: string;
	name: string;
	avatar: string;
	bio: string;
	location: string;
	followers: string;
};
export const people: Person[] = [
	{
		handle: 'mina',
		name: 'Mina Okafor',
		avatar: 'mina',
		bio: 'Designing things for the internet. Usually outside when I’m not.',
		location: 'London, UK',
		followers: '2,418'
	},
	{
		handle: 'leo',
		name: 'Leo Martin',
		avatar: 'leo',
		bio: 'Photographer. Taking the long way home.',
		location: 'Portland, OR',
		followers: '18.2K'
	},
	{
		handle: 'nora',
		name: 'Nora Chen',
		avatar: 'nora',
		bio: 'Architecture, cities, and the spaces in between.',
		location: 'Copenhagen, DK',
		followers: '8,604'
	},
	{
		handle: 'sam',
		name: 'Sam Rivera',
		avatar: 'sam',
		bio: 'Independent filmmaker. Always watching the light.',
		location: 'Brooklyn, NY',
		followers: '24.1K'
	},
	{
		handle: 'aya',
		name: 'Aya Williams',
		avatar: 'aya',
		bio: 'Making software feel a little more human.',
		location: 'Amsterdam, NL',
		followers: '12.8K'
	}
];
export const person = (handle: string) => people.find((p) => p.handle === handle) ?? people[0];
export type Post = {
	id: string;
	author: string;
	text: string;
	time: string;
	topic: string;
	likes: number;
	reposts: number;
	replies: number;
	image?: string;
	alt?: string;
	video?: string;
	quote?: string;
	repostedBy?: string;
	note?: string;
	noteSource?: string;
};
export const initialPosts: Post[] = [
	{
		id: 'long-way-home',
		author: 'leo',
		time: '18m',
		topic: 'Photography',
		text: 'Took the long way home. No signal, no itinerary. Just this.\n\nA reminder to leave a little room for getting lost.',
		image: 'coast',
		alt: 'Layers of green mountains disappearing into low morning mist',
		likes: 1284,
		reposts: 86,
		replies: 24
	},
	{
		id: 'good-interfaces',
		author: 'aya',
		time: '42m',
		topic: 'Design',
		text: 'The best interface improvement we shipped this week? Removing a step.\n\nSometimes the feature is the thing you don’t have to do.',
		likes: 462,
		reposts: 63,
		replies: 18,
		repostedBy: 'nora'
	},
	{
		id: 'in-motion',
		author: 'sam',
		time: '1h',
		topic: 'Film',
		text: 'A little reminder of what an independent animation crew can make. Open films are such a gift to the next generation of filmmakers.',
		video: 'film',
		alt: 'A scene from an openly licensed animated short film',
		likes: 892,
		reposts: 114,
		replies: 36
	},
	{
		id: 'human-scale',
		author: 'nora',
		time: '2h',
		topic: 'Architecture',
		text: 'Good buildings should make you stop and look up. Better ones make you want to stay.',
		image: 'architecture',
		alt: 'Sculptural white contemporary building photographed against a blue sky',
		likes: 318,
		reposts: 22,
		replies: 9
	},
	{
		id: 'less-but-better',
		author: 'mina',
		time: '3h',
		topic: 'Design',
		text: 'This. Every extra decision is something we ask of the person on the other side of the screen.',
		quote: 'good-interfaces',
		likes: 92,
		reposts: 8,
		replies: 4
	},
	{
		id: 'city-after-dark',
		author: 'leo',
		time: '4h',
		topic: 'Photography',
		text: 'Blue hour is undefeated. One from the archive.',
		image: 'city',
		alt: 'A neon-lit city street after dark',
		likes: 2471,
		reposts: 208,
		replies: 41,
		note: 'Blue hour is a twilight period, not necessarily a full hour. Its duration varies with latitude, season, and weather.',
		noteSource: 'https://en.wikipedia.org/wiki/Blue_hour'
	}
];
export const notifications = [
	{
		id: 'n1',
		author: 'aya',
		kind: 'liked your post',
		post: 'less-but-better',
		time: '12m',
		read: false
	},
	{ id: 'n2', author: 'leo', kind: 'started following you', post: '', time: '38m', read: false },
	{
		id: 'n3',
		author: 'nora',
		kind: 'reposted your post',
		post: 'less-but-better',
		time: '2h',
		read: true
	}
];
