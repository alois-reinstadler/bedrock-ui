import { getContext, setContext } from 'svelte';
import { initialPosts, notifications, type Post } from './data.js';
const key = Symbol('mosaic');
export class SocialState {
	posts = $state<Post[]>(structuredClone(initialPosts));
	liked = $state<string[]>([]);
	saved = $state<string[]>(['human-scale']);
	reposted = $state<string[]>([]);
	following = $state<string[]>(['leo', 'aya']);
	replies = $state<Record<string, string[]>>({
		'long-way-home': ['This is my sign to close the laptop and go for a walk.']
	});
	notifications = $state(structuredClone(notifications));
	draft = $state('');
	announcement = $state('');
	profileName = $state('Mina Okafor');
	profileBio = $state('Designing things for the internet. Usually outside when I’m not.');
	toggle(kind: 'liked' | 'saved' | 'reposted' | 'following', id: string) {
		this[kind] = this[kind].includes(id)
			? this[kind].filter((item) => item !== id)
			: [...this[kind], id];
	}
	publish(text: string, quote?: string, image?: string) {
		if (!text.trim() && !image) return;
		this.posts.unshift({
			id: `local-${Date.now()}`,
			author: 'mina',
			text: text.trim(),
			time: 'now',
			topic: 'Design',
			likes: 0,
			replies: 0,
			reposts: 0,
			quote,
			image,
			alt: image ? 'Misty green mountain landscape' : undefined
		});
		this.announcement = quote ? 'Quote posted.' : 'Your post is live.';
	}
	reply(id: string, text: string) {
		if (!text.trim()) return;
		this.replies[id] = [...(this.replies[id] ?? []), text.trim()];
		this.announcement = 'Reply posted.';
	}
}
export const createSocial = () => setContext(key, new SocialState());
export const useSocial = () => getContext<SocialState>(key);
