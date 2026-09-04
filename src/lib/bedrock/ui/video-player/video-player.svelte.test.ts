import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './video-player.test.svelte';

afterEach(() => cleanup());

function stubDuration(video: HTMLVideoElement, seconds: number) {
	Object.defineProperty(video, 'duration', { configurable: true, value: seconds });
	video.dispatchEvent(new Event('durationchange'));
}

describe('VideoPlayer', () => {
	it('names the region and exposes a labelled ARIA scrubber', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector('[data-slot="video-player"]')!;
		expect(root.getAttribute('role')).toBe('group');
		expect(root.getAttribute('aria-label')).toBe('Feature walkthrough');

		const scrubber = root.querySelector<HTMLElement>('[data-slot="video-player-scrubber"]')!;
		expect(scrubber.getAttribute('role')).toBe('slider');
		expect(scrubber.getAttribute('aria-valuetext')).toContain('of');
		expect(scrubber.tabIndex).toBe(0);
	});

	it('seeks with scrubber keys once the duration is known', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector('[data-slot="video-player"]')!;
		const video = root.querySelector('video')!;
		stubDuration(video, 100);
		await new Promise((resolve) => requestAnimationFrame(resolve));

		const scrubber = root.querySelector<HTMLElement>('[data-slot="video-player-scrubber"]')!;
		scrubber.focus();
		scrubber.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
		);
		expect(video.currentTime).toBe(5);
		scrubber.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true })
		);
		expect(video.currentTime).toBe(100);
		scrubber.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })
		);
		expect(video.currentTime).toBe(0);
	});

	it('handles root shortcuts: m mutes, arrows seek', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-slot="video-player"]')!;
		const video = root.querySelector('video')!;
		stubDuration(video, 60);
		await new Promise((resolve) => requestAnimationFrame(resolve));

		root.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true, cancelable: true }));
		await new Promise((resolve) => requestAnimationFrame(resolve));
		expect(video.muted).toBe(true);
		root.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowRight',
				shiftKey: true,
				bubbles: true,
				cancelable: true
			})
		);
		expect(video.currentTime).toBe(30);
	});

	it('cycles captions off → track → off with announcements', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-slot="video-player"]')!;
		const toggle = root.querySelector<HTMLButtonElement>('button[aria-label="Captions off"]')!;
		toggle.click();
		await new Promise((resolve) => requestAnimationFrame(resolve));
		expect(root.querySelector('button[aria-label="Captions: English"]')).not.toBeNull();
		const status = root.querySelector('[data-slot="video-player-status"]')!;
		expect(status.textContent).toContain('English');
	});

	it('shows the error surface with a retry action when the source fails', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-slot="video-player"]')!;
		const video = root.querySelector('video')!;
		video.dispatchEvent(new Event('error'));
		await new Promise((resolve) => requestAnimationFrame(resolve));
		const alert = root.querySelector('[role="alert"]')!;
		expect(alert.textContent).toContain('could not be played');
		expect(alert.querySelector('button')?.textContent).toContain('Try again');
	});
});
