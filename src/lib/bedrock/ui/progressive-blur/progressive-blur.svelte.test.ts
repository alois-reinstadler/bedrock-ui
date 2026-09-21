import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './progressive-blur.test.svelte';

afterEach(() => cleanup());

describe('ProgressiveBlur', () => {
	it('exposes a physical side, compatibility attributes, and bounded blur layers', async () => {
		const view = await render(Fixture);
		const blur = view.container.querySelector<HTMLElement>(
			'[data-testid="standalone"] [data-slot="progressive-blur"]'
		);

		expect(blur?.dataset.side).toBe('left');
		expect(blur?.dataset.orientation).toBe('horizontal');
		expect(blur?.dataset.edge).toBe('start');
		expect(blur?.dataset.visible).toBe('false');
		expect(blur?.getAttribute('aria-hidden')).toBe('true');
		expect(blur?.style.getPropertyValue('--progressive-blur-size').trim()).toBe('3rem');
		expect(blur?.style.getPropertyValue('--progressive-blur-strength').trim()).toBe('20px');
		expect(blur?.querySelectorAll('[data-blur-layer]')).toHaveLength(5);
		expect(
			view.container.querySelector<HTMLElement>(
				'[data-testid="legacy"] [data-slot="progressive-blur"]'
			)?.dataset.side
		).toBe('top');
	});

	it('immediately clears standalone decoration when a sibling control receives focus', async () => {
		const view = await render(Fixture);
		const parent = view.container.querySelector<HTMLElement>('[data-testid="legacy"]');
		const blur = parent?.querySelector<HTMLElement>('[data-slot="progressive-blur"]');
		const button = parent?.querySelector<HTMLButtonElement>('button');
		if (!blur || !button) throw new Error('Standalone focus fixture missing');
		expect(getComputedStyle(blur).opacity).toBe('1');
		button.focus();
		expect(document.activeElement).toBe(button);
		for (const layer of blur.querySelectorAll(
			'[data-blur-layer], [data-blur-fallback], [data-blur-tint]'
		)) {
			expect(getComputedStyle(layer).opacity).toBe('0');
			expect(getComputedStyle(layer).transitionDuration).toBe('0s');
		}
		expect(getComputedStyle(blur).opacity).toBe('1');
		expect(getComputedStyle(blur).transitionDuration).toBe('0s');
		expect(getComputedStyle(blur).pointerEvents).toBe('none');
	});

	it('shows only physical edges with hidden overflow content', async () => {
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
		await vi.waitFor(() => expect(root?.dataset.overflowVertical).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.overflowHorizontal).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.scrollBottomHidden).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.scrollRightHidden).toBe('true'));
		expect(root?.dataset.scrollTopHidden).toBe('false');
		expect(root?.dataset.scrollLeftHidden).toBe('false');

		Object.defineProperties(viewport, {
			scrollTop: { configurable: true, value: 24 },
			scrollLeft: { configurable: true, value: 24 }
		});
		viewport.dispatchEvent(new Event('scroll'));

		await vi.waitFor(() => expect(root?.dataset.scrollTopHidden).toBe('true'));
		await vi.waitFor(() => expect(root?.dataset.scrollLeftHidden).toBe('true'));
	});

	it('keeps edge treatments inactive without overflow and while focus is inside', async () => {
		const view = await render(Fixture);
		const fittingRoot = view.container.querySelector<HTMLElement>('[data-testid="no-overflow"]');
		const fittingViewport = fittingRoot?.querySelector<HTMLElement>(
			'[data-slot="scroll-area-viewport"]'
		);
		if (!fittingViewport) throw new Error('Non-overflowing viewport was not rendered');

		Object.defineProperties(fittingViewport, {
			clientHeight: { configurable: true, value: 96 },
			clientWidth: { configurable: true, value: 160 },
			scrollHeight: { configurable: true, value: 48 },
			scrollWidth: { configurable: true, value: 80 }
		});
		fittingViewport.dispatchEvent(new Event('scroll'));
		await vi.waitFor(() => expect(fittingRoot?.dataset.overflowVertical).toBe('false'));
		expect(fittingRoot?.dataset.overflowHorizontal).toBe('false');
		expect(
			Array.from(
				fittingRoot?.querySelectorAll<HTMLElement>('[data-scroll-edge] [data-blur-layer]') ?? []
			).every((edge) => getComputedStyle(edge).opacity === '0')
		).toBe(true);

		const scrollRoot = view.container.querySelector<HTMLElement>('[data-testid="scroll-area"]');
		const focusTarget = scrollRoot?.querySelector<HTMLButtonElement>(
			'[data-testid="focus-target"]'
		);
		focusTarget?.focus();
		expect(document.activeElement).toBe(focusTarget);
		expect(
			Array.from(
				scrollRoot?.querySelectorAll<HTMLElement>('[data-scroll-edge] [data-blur-layer]') ?? []
			).every((edge) => getComputedStyle(edge).opacity === '0')
		).toBe(true);
	});
});
