import { createContext } from 'svelte';
import { films } from './catalog.js';
export class Library {
	saved = $state<string[]>([]);
	progress = $state<Record<string, number>>({});
	ready = $state(false);
	notice = $state('');
	load() {
		try {
			const data = JSON.parse(localStorage.getItem('bedrock-frame-v2') ?? '{}');
			if (Array.isArray(data.saved))
				this.saved = data.saved.filter((slug: unknown) => films.some((film) => film.slug === slug));
			if (data.progress && typeof data.progress === 'object')
				for (const film of films) {
					const seconds = data.progress[film.slug];
					if (
						typeof seconds === 'number' &&
						Number.isFinite(seconds) &&
						seconds > 0 &&
						seconds < film.duration - 2
					)
						this.progress[film.slug] = seconds;
				}
		} catch {
			this.notice = 'Your list is available for this session. Browser storage is unavailable.';
		}
		this.ready = true;
	}
	persist() {
		try {
			localStorage.setItem(
				'bedrock-frame-v2',
				JSON.stringify({ saved: this.saved, progress: this.progress })
			);
		} catch {
			this.notice = 'Your changes are saved for this session only.';
		}
	}
	toggle(slug: string) {
		this.saved = this.saved.includes(slug)
			? this.saved.filter((item) => item !== slug)
			: [...this.saved, slug];
		this.notice = `${films.find((film) => film.slug === slug)?.title} ${this.saved.includes(slug) ? 'added to' : 'removed from'} your list.`;
		this.persist();
	}
	remember(slug: string, seconds: number, duration: number) {
		if (!Number.isFinite(seconds) || seconds < 0) return;
		if (seconds >= duration - 2 || seconds < 1) delete this.progress[slug];
		else this.progress[slug] = Math.floor(seconds);
		this.persist();
	}
}
export const [getLibrary, setLibrary] = createContext<Library>();
