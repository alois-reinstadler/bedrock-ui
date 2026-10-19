import { createRawSnippet, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { Image } from './index';

const source = (color: string) =>
	`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><path fill="${color}" d="M0 0h160v90H0z"/></svg>`)}`;

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('Image', () => {
	it('keeps the skeleton until decoding finishes and ignores a replaced request', async () => {
		const pending = new Map<HTMLImageElement, () => void>();
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
			this: HTMLImageElement
		) {
			return new Promise<void>((resolve) => pending.set(this, resolve));
		});
		const onload = vi.fn();
		const view = await render(Image, { src: source('green'), alt: 'Landscape', onload });
		const frame = view.container.querySelector<HTMLElement>('[data-slot="image"]')!;
		const first = frame.querySelector('img')!;
		await vi.waitFor(() => expect(pending.has(first)).toBe(true));
		expect(frame.dataset.state).toBe('loading');
		expect(frame.getAttribute('aria-busy')).toBe('true');
		expect(frame.querySelector('[data-slot="skeleton"]')?.getAttribute('aria-hidden')).toBe('true');
		expect(first.style.opacity).toBe('0');
		expect(onload).toHaveBeenCalledOnce();

		await view.rerender({ src: source('blue') });
		const second = frame.querySelector('img')!;
		await vi.waitFor(() => expect(pending.has(second)).toBe(true));
		expect(second).not.toBe(first);
		pending.get(first)!();
		await tick();
		expect(frame.dataset.state).toBe('loading');
		pending.get(second)!();
		await vi.waitFor(() => expect(frame.dataset.state).toBe('loaded'));
		expect(frame.querySelector('[data-slot="skeleton"]')).toBeNull();
		expect(frame.getAttribute('aria-busy')).toBe('false');
		expect(second.style.opacity).toBe('1');
	});

	it('recognizes images completed before listeners attach and preserves native attributes', async () => {
		const src = source('orange');
		const cached = document.createElement('img');
		cached.src = src;
		await cached.decode();
		const view = await render(Image, {
			src,
			alt: 'Cached landscape',
			width: 160,
			height: 90,
			class: 'rounded-xl',
			imageClass: 'object-contain',
			loading: 'lazy',
			fetchpriority: 'low'
		});
		const frame = view.container.querySelector<HTMLElement>('[data-slot="image"]')!;
		const img = frame.querySelector('img')!;
		await vi.waitFor(() => expect(frame.dataset.state).toBe('loaded'));
		expect(Number.parseFloat(frame.style.aspectRatio)).toBeCloseTo(160 / 90, 4);
		expect(frame.classList.contains('rounded-xl')).toBe(true);
		expect(img.classList.contains('object-contain')).toBe(true);
		expect(img.getAttribute('alt')).toBe('Cached landscape');
		expect(img.getAttribute('width')).toBe('160');
		expect(img.loading).toBe('lazy');
		expect(img.fetchPriority).toBe('low');
	});

	it('loads srcset-only images and updates the selected source', async () => {
		const view = await render(Image, {
			srcset: `${source('green')} 1x`,
			alt: 'Responsive landscape'
		});
		const frame = view.container.querySelector<HTMLElement>('[data-slot="image"]')!;
		await vi.waitFor(() => expect(frame.dataset.state).toBe('loaded'));
		expect(frame.querySelector('img')?.currentSrc).toBe(source('green'));
		await view.rerender({ srcset: `${source('blue')} 1x` });
		await vi.waitFor(() => expect(frame.dataset.state).toBe('loaded'));
		expect(frame.querySelector('img')?.currentSrc).toBe(source('blue'));
	});

	it('retains the accessible name after failure and recovers with a new source', async () => {
		const onerror = vi.fn();
		const view = await render(Image, {
			src: 'data:image/png;base64,broken',
			alt: 'Mountain view',
			onerror,
			fallback: createRawSnippet(() => ({ render: () => '<span>Preview unavailable</span>' }))
		});
		const frame = view.container.querySelector<HTMLElement>('[data-slot="image"]')!;
		await vi.waitFor(() => expect(frame.dataset.state).toBe('error'));
		expect(frame.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Mountain view');
		expect(frame.querySelector('img')?.getAttribute('aria-hidden')).toBe('true');
		expect(frame.textContent).toContain('Preview unavailable');
		expect(frame.querySelector('[data-slot="skeleton"]')).toBeNull();
		expect(onerror).toHaveBeenCalledOnce();

		await view.rerender({ src: source('pink') });
		await vi.waitFor(() => expect(frame.dataset.state).toBe('loaded'));
		expect(frame.querySelector('[data-slot="image-fallback"]')).toBeNull();
		expect(frame.querySelector('img')?.hasAttribute('aria-hidden')).toBe(false);
	});

	it('does not request an empty source or leave decorative media loading forever', async () => {
		const view = await render(Image, { src: '', alt: '', aspectRatio: 1 });
		const frame = view.container.querySelector<HTMLElement>('[data-slot="image"]')!;
		expect(frame.dataset.state).toBe('error');
		expect(frame.style.aspectRatio).toBe('1 / 1');
		expect(frame.querySelector('img')).toBeNull();
		expect(frame.querySelector('[data-slot="skeleton"]')).toBeNull();
		expect(frame.querySelector('[data-slot="image-fallback"]')?.getAttribute('aria-hidden')).toBe(
			'true'
		);
		expect(frame.querySelector('[role="img"]')).toBeNull();
	});
});
