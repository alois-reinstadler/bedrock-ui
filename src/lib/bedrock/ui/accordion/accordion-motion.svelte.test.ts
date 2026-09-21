import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './accordion-motion.test.svelte';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
async function sampleHeight(container: Element, duration = 450) {
	const heights: number[] = [];
	const start = performance.now();
	do {
		heights.push(
			container.querySelector('[data-slot="accordion-content"]')?.getBoundingClientRect().height ??
				0
		);
		await frame();
	} while (performance.now() - start < duration);
	return heights;
}

function trigger(container: Element) {
	return container.querySelector<HTMLButtonElement>('[data-slot="accordion-trigger"]')!;
}

describe('Accordion motion geometry', () => {
	it('closes monotonically through removal without restoring intrinsic height', async () => {
		const view = await render(Fixture, { props: { initial: 'details' } });
		await frame();
		await frame();
		const original = view.container
			.querySelector('[data-slot="accordion-content"]')!
			.getBoundingClientRect().height;
		trigger(view.container).click();
		const heights = await sampleHeight(view.container);
		expect(heights.some((height) => height > 1 && height < original - 1)).toBe(true);
		for (let index = 1; index < heights.length; index++) {
			expect(heights[index]).toBeLessThanOrEqual(heights[index - 1] + 1);
		}
		expect(heights.at(-1)).toBe(0);
		expect(trigger(view.container).getAttribute('aria-expanded')).toBe('false');
	});

	it('reverses from the current visual height and settles at natural height', async () => {
		const view = await render(Fixture);
		await frame();
		trigger(view.container).click();
		await sampleHeight(view.container, 70);
		const panel = view.container.querySelector<HTMLElement>('[data-slot="accordion-content"]')!;
		const before = panel.getBoundingClientRect().height;
		trigger(view.container).click();
		flushSync();
		expect(Math.abs(panel.getBoundingClientRect().height - before)).toBeLessThan(2);
		await sampleHeight(view.container, 30);
		const closing = panel.getBoundingClientRect().height;
		trigger(view.container).click();
		flushSync();
		expect(Math.abs(panel.getBoundingClientRect().height - closing)).toBeLessThan(2);
		await sampleHeight(view.container);
		expect(panel.getBoundingClientRect().height).toBeGreaterThanOrEqual(180);
		expect(panel.style.height).toBe('');
		expect(
			panel.getAnimations().filter((animation) => animation.playState === 'running')
		).toHaveLength(0);
	});

	it('settles without running animations when reduced motion is requested', async () => {
		const original = window.matchMedia.bind(window);
		vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
			query === '(prefers-reduced-motion: reduce)'
				? { ...original(query), matches: true }
				: original(query)
		);
		const view = await render(Fixture);
		trigger(view.container).click();
		flushSync();
		await frame();
		const panel = view.container.querySelector<HTMLElement>('[data-slot="accordion-content"]')!;
		expect(panel.getBoundingClientRect().height).toBeGreaterThanOrEqual(180);
		expect(
			panel.getAnimations().filter((animation) => animation.playState === 'running')
		).toHaveLength(0);
		trigger(view.container).click();
		flushSync();
		await frame();
		expect(view.container.querySelector('[data-slot="accordion-content"]')).toBeNull();
	});

	it('keeps explicitly force-mounted closed content available to its consumer', async () => {
		const view = await render(Fixture, { props: { forceMount: true } });
		expect(view.container.querySelector('[data-slot="accordion-content"]')).not.toBeNull();
		expect(trigger(view.container).getAttribute('aria-expanded')).toBe('false');
	});
});
