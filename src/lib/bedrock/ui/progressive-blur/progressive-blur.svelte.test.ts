import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './progressive-blur.test.svelte';

afterEach(() => cleanup());

describe('ProgressiveBlur', () => {
	it('exposes orientation, edge, visibility, and visual custom properties', async () => {
		const view = await render(Fixture);
		const blur = view.container.querySelector<HTMLElement>(
			'[data-testid="standalone"] [data-slot="progressive-blur"]'
		);

		expect(blur?.dataset.orientation).toBe('horizontal');
		expect(blur?.dataset.edge).toBe('start');
		expect(blur?.dataset.visible).toBe('false');
		expect(blur?.getAttribute('aria-hidden')).toBe('true');
		expect(blur?.style.getPropertyValue('--progressive-blur-size').trim()).toBe('3rem');
		expect(blur?.style.getPropertyValue('--progressive-blur-strength').trim()).toBe('20px');
	});

	it('adds both logical edge pairs to a scroll area and updates its scroll state', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-testid="scroll-area"]');
		const viewport = root?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');

		expect(root?.querySelectorAll('[data-scroll-edge]')).toHaveLength(4);
		if (!viewport) throw new Error('ScrollArea viewport was not rendered');
		Object.defineProperties(viewport, {
			clientHeight: { configurable: true, value: 96 },
			clientWidth: { configurable: true, value: 160 },
			scrollHeight: { configurable: true, value: 384 },
			scrollWidth: { configurable: true, value: 480 }
		});
		viewport.dispatchEvent(new Event('scroll'));
		await vi.waitFor(() => expect(root?.dataset.scrollVerticalEnd).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.scrollHorizontalEnd).toBe('true'));

		Object.defineProperties(viewport, {
			scrollTop: { configurable: true, value: 24 },
			scrollLeft: { configurable: true, value: 24 }
		});
		viewport.dispatchEvent(new Event('scroll'));

		await vi.waitFor(() => expect(root?.dataset.scrollVerticalStart).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.scrollHorizontalStart).toBe('true'));
	});
});
