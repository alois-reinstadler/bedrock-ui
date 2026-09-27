import { describe, expect, it, vi } from 'vitest';
import { MusicPlayer } from './player.svelte.js';
import { tracks } from './data.js';

function pendingAudio() {
	const requests: { resolve: () => void; reject: (error: Error) => void }[] = [];
	const audio = {
		paused: true,
		src: '',
		volume: 1,
		play: vi.fn(() => new Promise<void>((resolve, reject) => requests.push({ resolve, reject }))),
		pause: vi.fn(),
		removeAttribute: vi.fn(),
		load: vi.fn()
	};
	const player = new MusicPlayer();
	player.audio = audio as unknown as HTMLAudioElement;
	return { player, audio, requests };
}

describe('music playback intent', () => {
	it('pauses a pending next track even while the media element reports paused', async () => {
		const { player, audio, requests } = pendingAudio();
		player.play(tracks[0]);
		player.next();
		expect(player.playing).toBe(true);
		expect(player.current.id).toBe(tracks[1].id);
		player.handlePause(); // the previous source may emit a queued pause event
		expect(player.playing).toBe(true);
		player.toggle();
		expect(player.playing).toBe(false);
		expect(audio.play).toHaveBeenCalledTimes(2);
		expect(audio.pause).toHaveBeenCalledTimes(1);
		requests[0].resolve();
		requests[1].resolve();
		await Promise.resolve();
		player.handlePlay(); // a late media event cannot revive playback
		expect(player.playing).toBe(false);
		expect(audio.pause).toHaveBeenCalledTimes(2);
	});

	it('ignores an obsolete play rejection after another track was requested', async () => {
		const { player, requests } = pendingAudio();
		player.play(tracks[0]);
		player.next();
		requests[0].reject(new Error('The old source was replaced'));
		await Promise.resolve();
		expect(player.playing).toBe(true);
		expect(player.message).toBe('');
		requests[1].resolve();
		await Promise.resolve();
		expect(player.current.id).toBe(tracks[1].id);
		expect(player.playing).toBe(true);
	});
});
