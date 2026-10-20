import { createRawSnippet, flushSync } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { Video } from './index';

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	vi.restoreAllMocks();
});

function ready(video: HTMLVideoElement, state = 2) {
	Object.defineProperty(video, 'readyState', { configurable: true, value: state });
	flushSync(() => video.dispatchEvent(new Event('loadeddata')));
}

async function pending(props: Partial<import('./video.svelte').VideoProps> = {}) {
	const view = await render(Video, {
		label: 'Sample clip',
		src: '/demo/clip.mp4',
		preload: 'none',
		...props
	});
	const root = view.container.querySelector<HTMLElement>('[data-slot="video"]')!;
	const video = root.querySelector('video')!;
	// Let the browser finish initial resource selection, which emits loadstart even with preload=none.
	await vi.waitFor(() => expect(video.networkState).not.toBe(HTMLMediaElement.NETWORK_EMPTY));
	return { view, root, video };
}

describe('Video', () => {
	it('keeps the skeleton through metadata, reveals a frame and preserves controls during buffering', async () => {
		const onloadeddata = vi.fn();
		const { root, video } = await pending({ onloadeddata });
		expect(root.dataset.state).toBe('loading');
		expect(root.getAttribute('aria-busy')).toBe('true');
		expect(root.querySelector('[data-slot="skeleton"]')?.getAttribute('aria-hidden')).toBe('true');
		expect(video.inert).toBe(true);
		ready(video, 1);
		expect(root.dataset.state).toBe('loading');
		ready(video);
		expect(root.dataset.state).toBe('loaded');
		expect(video.inert).toBe(false);
		expect(video.controls).toBe(true);
		expect(root.querySelector('[data-slot="skeleton"]')).toBeNull();
		expect(onloadeddata).toHaveBeenCalledTimes(2);
		flushSync(() => video.dispatchEvent(new Event('waiting')));
		expect(root.dataset.state).toBe('loaded');
	});

	it('ignores replaced sources and pending reveal timers, and resets after an explicit load', async () => {
		const { view, root, video: first } = await pending({ minimumLoadingDuration: 1000 });
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
		ready(first);
		expect(root.dataset.state).toBe('loading');
		expect(root.querySelector('button')).toBeNull();
		await view.rerender({ src: '/demo/clip.mp4?replacement=1' });
		const second = root.querySelector('video')!;
		expect(second).not.toBe(first);
		flushSync(() => first.dispatchEvent(new Event('error')));
		vi.advanceTimersByTime(1100);
		flushSync();
		expect(root.dataset.state).toBe('loading');
		ready(second);
		expect(root.dataset.state).toBe('loaded');
		flushSync(() => second.dispatchEvent(new Event('emptied')));
		expect(root.dataset.state).toBe('loading');
		ready(second);
		vi.advanceTimersByTime(1100);
		flushSync();
		expect(root.dataset.state).toBe('loaded');
	});

	it('handles media already ready before attachment and forwards native attributes and captions', async () => {
		vi.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(4);
		const view = await render(Video, {
			label: 'Ready clip',
			src: '/demo/clip.mp4',
			width: 320,
			height: 240,
			preload: 'none',
			loop: true,
			muted: true,
			class: 'rounded-xl',
			videoClass: 'object-cover',
			captions: [{ src: '/demo/clip.en.vtt', srclang: 'en', label: 'English', default: true }]
		});
		const root = view.container.querySelector<HTMLElement>('[data-slot="video"]')!;
		const video = root.querySelector('video')!;
		expect(root.dataset.state).toBe('loaded');
		expect(root.style.aspectRatio).toBe('1.33333 / 1');
		expect(root.classList.contains('rounded-xl')).toBe(true);
		expect(video.classList.contains('object-cover')).toBe(true);
		expect(video.loop).toBe(true);
		expect(video.muted).toBe(true);
		expect(video.playsInline).toBe(true);
		expect(video.getAttribute('aria-label')).toBe('Ready clip');
		expect(video.querySelector('track')?.srclang).toBe('en');
	});

	it('shows a named fallback on failure and recovers with a new source', async () => {
		const onerror = vi.fn();
		const { view, root, video } = await pending({
			onerror,
			fallback: createRawSnippet(() => ({ render: () => '<span>Clip unavailable</span>' }))
		});
		flushSync(() => video.dispatchEvent(new Event('error')));
		expect(root.dataset.state).toBe('error');
		expect(root.getAttribute('aria-label')).toBe('Sample clip');
		expect(root.getAttribute('aria-busy')).toBe('false');
		expect(root.textContent).toContain('Clip unavailable');
		expect(onerror).toHaveBeenCalledOnce();
		expect(video.inert).toBe(true);
		ready(video);
		expect(root.dataset.state).toBe('error');
		await view.rerender({ src: '/demo/clip.mp4?retry=1' });
		ready(root.querySelector('video')!);
		expect(root.dataset.state).toBe('loaded');
	});

	it('offers an explicit load action when preload is deferred', async () => {
		const { root, video } = await pending();
		const load = vi.spyOn(video, 'load').mockImplementation(() => {});
		const button = root.querySelector('button')!;
		expect(button.textContent).toBe('Load video');
		button.click();
		expect(video.preload).toBe('auto');
		expect(load).toHaveBeenCalledOnce();
		ready(video);
		expect(root.querySelector('button')).toBeNull();
	});

	it('does not request an empty source or show an endless skeleton', async () => {
		const view = await render(Video, { label: 'Missing clip', src: ' ', aspectRatio: 1 });
		const root = view.container.querySelector<HTMLElement>('[data-slot="video"]')!;
		expect(root.dataset.state).toBe('error');
		expect(root.style.aspectRatio).toBe('1 / 1');
		expect(root.querySelector('video')).toBeNull();
		expect(root.querySelector('[data-slot="skeleton"]')).toBeNull();
		expect(root.textContent).toContain('Video unavailable');
	});

	it('pauses and releases detached media and cancels delayed reveals', async () => {
		const { view, video } = await pending({ minimumLoadingDuration: 1000 });
		const pause = vi.spyOn(video, 'pause');
		const load = vi.spyOn(video, 'load');
		ready(video);
		await view.unmount();
		expect(pause).toHaveBeenCalledOnce();
		expect(load).toHaveBeenCalledOnce();
		expect(video.hasAttribute('src')).toBe(false);
	});
});
