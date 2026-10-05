import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './panel-families.test.svelte';

afterEach(cleanup);
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const paintAnimations = (element: Element) =>
	element
		.getAnimations()
		.filter(
			(animation) =>
				animation.effect instanceof KeyframeEffect &&
				animation.effect.getKeyframes().some((key) => 'opacity' in key)
		);

describe('panel-family primitive integration', () => {
	it('keeps initial open prose and selected tab readable without an entrance', async () => {
		const view = await render(Fixture, { props: { initialOpen: true } });
		await frame();
		const prose = view.container.querySelector('[data-slot="accordion-content"]')!;
		expect(prose.firstElementChild!.getAnimations()).toHaveLength(0);
		expect(
			paintAnimations(
				view.container.querySelector('[data-slot="tabs-content"][data-state="active"]')!
			)
		).toHaveLength(0);
	});
	it('animates the actual Bits active tab, commits selection immediately and settles live reduction', async () => {
		const view = await render(Fixture);
		const tabs = view.container.querySelectorAll<HTMLButtonElement>('[data-slot="tabs-trigger"]');
		tabs[1].click();
		flushSync();
		await frame();
		const active = view.container.querySelector('[data-slot="tabs-content"][data-state="active"]')!;
		expect(active.textContent).toContain('Second panel');
		expect(tabs[1].getAttribute('aria-selected')).toBe('true');
		expect(paintAnimations(active).length).toBeGreaterThan(0);
		view.container.querySelector<HTMLButtonElement>('button')!.click();
		flushSync();
		await frame();
		expect(
			paintAnimations(active).filter((animation) => animation.playState === 'running')
		).toHaveLength(0);
	});
	it('animates the whole calendar grid after explicit month navigation', async () => {
		const view = await render(Fixture);
		const calendar = view.container.querySelector('[data-testid="calendar"]')!;
		const next = calendar.querySelector<HTMLButtonElement>('[data-calendar-next-button]')!;
		expect(next).not.toBeNull();
		next.click();
		flushSync();
		await frame();
		const grids = calendar.querySelectorAll('[role="grid"]');
		expect(grids.length).toBeGreaterThan(0);
		expect([...grids].some((grid) => paintAnimations(grid).length > 0)).toBe(true);
	});
	it('makes retained accordion exits inert immediately', async () => {
		const view = await render(Fixture, { props: { initialOpen: true } });
		view.container.querySelector<HTMLButtonElement>('[data-slot="accordion-trigger"]')!.click();
		flushSync();
		await frame();
		const panel = view.container.querySelector<HTMLElement>('[data-slot="accordion-content"]');
		expect(panel === null || panel.inert).toBe(true);
	});
});
