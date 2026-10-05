import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import LazyMap from './LazyMap.svelte';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

it('defers the map until the user activates it', async () => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
	const view = await render(LazyMap, { activation: 'interaction' });
	expect(view.container.querySelector('[data-slot="map"]')).toBeNull();
	view.container.querySelector('button')!.click();
	await expect
		.poll(() => view.container.querySelector('[data-map-unavailable]')?.textContent ?? '', {
			timeout: 10_000
		})
		.toContain('WebGL2');
	expect(view.container.querySelector('button')).toBeNull();
});

it('waits for intersection and disconnects the observer after activation', async () => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
	let notify!: IntersectionObserverCallback;
	const disconnect = vi.fn();
	const observe = vi.fn();
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(callback: IntersectionObserverCallback) {
				notify = callback;
			}
			observe = observe;
			disconnect = disconnect;
		}
	);
	const view = await render(LazyMap);
	expect(observe).toHaveBeenCalledOnce();
	expect(view.container.querySelector('[data-slot="map"]')).toBeNull();
	notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
	expect(disconnect).not.toHaveBeenCalled();
	notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
	await expect
		.poll(() => view.container.querySelector('[data-map-unavailable]')?.textContent ?? '', {
			timeout: 10_000
		})
		.toContain('WebGL2');
	expect(disconnect).toHaveBeenCalledOnce();
});
