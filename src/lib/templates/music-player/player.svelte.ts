import { getContext, setContext, untrack } from 'svelte';
import { tracks, collections, type Track } from './data.js';
import { clampVolume, volumeToGain } from '#lib/bedrock/media/volume.js';

export class MusicPlayer {
	current = $state(tracks[0]);
	queue = $state(tracks.map((track) => track.id));
	playing = $state(false);
	elapsed = $state(0);
	duration = $state(0);
	volume = $state(0.68);
	liked = $state<string[]>([]);
	saved = $state<string[]>(['after-hours', 'slow-mornings']);
	recent = $state<string[]>([]);
	repeat = $state(false);
	shuffle = $state(false);
	message = $state('');
	audio?: HTMLAudioElement;
	private request = 0;
	private pendingPlayback = false;
	connect = (audio: HTMLAudioElement) =>
		untrack(() => {
			this.audio = audio;
			audio.src = this.current.audio;
			audio.volume = volumeToGain(this.volume);
			try {
				const saved = JSON.parse(localStorage.getItem('drift-library-v2') ?? 'null');
				if (saved) {
					for (const key of ['liked', 'recent'] as const)
						if (Array.isArray(saved[key]))
							this[key] = saved[key].filter((id: string) => tracks.some((t) => t.id === id));
					if (Array.isArray(saved.saved))
						this.saved = saved.saved.filter((id: string) => collections.some((c) => c.id === id));
				}
			} catch {
				this.message = 'Your library is available for this visit.';
			}
			return () => {
				this.request++;
				this.pendingPlayback = false;
				this.playing = false;
				audio.pause();
				audio.removeAttribute('src');
				audio.load();
				this.audio = undefined;
			};
		});
	persist() {
		try {
			localStorage.setItem(
				'drift-library-v2',
				JSON.stringify({ liked: this.liked, saved: this.saved, recent: this.recent })
			);
		} catch {
			this.message = 'Your changes are saved for this visit.';
		}
	}
	async resume() {
		const audio = this.audio;
		if (!audio) return;
		const request = ++this.request;
		this.playing = true;
		this.pendingPlayback = true;
		this.message = '';
		try {
			await audio.play();
		} catch (error) {
			if (request !== this.request) return;
			this.playing = false;
			if (!(error instanceof DOMException && error.name === 'AbortError'))
				this.message = 'Playback could not start. Try pressing play again.';
		} finally {
			if (request === this.request) this.pendingPlayback = false;
		}
	}
	pause() {
		this.request++;
		this.pendingPlayback = false;
		this.playing = false;
		this.audio?.pause();
	}
	handlePlay() {
		// A queued media event cannot override a newer user pause.
		if (!this.playing) this.audio?.pause();
	}
	handlePause() {
		// Source changes can queue a pause event before the next play settles.
		if (!this.pendingPlayback && this.audio?.paused) this.playing = false;
	}
	handleError() {
		this.pause();
		this.message = 'This track could not be loaded. Try the next track.';
	}
	play(track: Track, list?: Track[]) {
		if (!this.audio) return;
		if (list?.length) this.queue = list.map((t) => t.id);
		if (!this.queue.includes(track.id)) this.queue = [...this.queue, track.id];
		if (track.id !== this.current.id) {
			this.current = track;
			this.audio.src = track.audio;
			this.elapsed = 0;
			this.duration = track.duration;
		}
		this.recent = [track.id, ...this.recent.filter((id) => id !== track.id)];
		this.persist();
		void this.resume();
	}
	toggle() {
		if (this.playing) this.pause();
		else this.play(this.current);
	}
	next(direction = 1) {
		if (!this.queue.length) return;
		const index = this.queue.indexOf(this.current.id);
		const next =
			this.shuffle && direction > 0 && this.queue.length > 1
				? (index + 1 + Math.floor(Math.random() * (this.queue.length - 1))) % this.queue.length
				: (index + direction + this.queue.length) % this.queue.length;
		this.play(tracks.find((t) => t.id === this.queue[next]) ?? tracks[0]);
	}
	ended() {
		this.playing = false;
		if (this.repeat) {
			this.seek(0);
			void this.resume();
		} else if (this.queue.indexOf(this.current.id) < this.queue.length - 1 || this.shuffle)
			this.next();
	}
	seek(value: number) {
		if (this.audio && Number.isFinite(this.audio.duration)) {
			this.audio.currentTime = Math.max(0, Math.min(value, this.audio.duration));
			this.elapsed = this.audio.currentTime;
		}
	}
	setVolume(value: number) {
		this.volume = clampVolume(value);
		if (this.audio) this.audio.volume = volumeToGain(this.volume);
	}
	like(id: string) {
		this.liked = this.liked.includes(id)
			? this.liked.filter((item) => item !== id)
			: [...this.liked, id];
		this.persist();
	}
	save(id: string) {
		this.saved = this.saved.includes(id)
			? this.saved.filter((item) => item !== id)
			: [...this.saved, id];
		this.persist();
	}
	enqueue(id: string) {
		this.queue = [...this.queue, id];
		this.message = 'Added to queue';
	}
}
const key = Symbol('drift-player');
export function providePlayer() {
	return setContext(key, new MusicPlayer());
}
export function usePlayer() {
	return getContext<MusicPlayer>(key);
}
