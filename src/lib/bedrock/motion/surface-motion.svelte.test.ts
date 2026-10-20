import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './surface-motion.test.svelte';

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const surface = (slot: string) => document.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
afterEach(() => cleanup());

describe('Bedrock surface motion', () => {
	it('reverses a retained popup close in place without zoom or duplicated content', async () => {
		const view = await render(Fixture);
		flushSync(() => view.component.setOpen(true));
		await frame();
		const panel = surface('popover-content');
		expect(panel).not.toBeNull();
		await expect.poll(() => getComputedStyle(panel).opacity).toBe('1');
		flushSync(() => view.component.setOpen(false));
		await frame();
		await frame();
		const closingOpacity = Number(getComputedStyle(panel).opacity);
		expect(panel.inert).toBe(true);
		expect(panel.getAttribute('aria-hidden')).toBe('true');
		flushSync(() => view.component.setOpen(true));
		await frame();
		expect(surface('popover-content')).toBe(panel);
		expect(document.querySelectorAll('[data-slot="popover-content"]')).toHaveLength(1);
		expect(Number(getComputedStyle(panel).opacity)).toBeGreaterThanOrEqual(closingOpacity - 0.05);
		const matrix = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
		expect(matrix.a).toBe(1);
		expect(matrix.d).toBe(1);
		expect(panel.inert).toBe(false);
		await expect.poll(() => getComputedStyle(panel).opacity).toBe('1');
	});

	it('carries live reduction through popup and dialog portals and styles the actual backdrop', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'Open motion dialog' }).click();
		const panel = surface('dialog-content');
		const backdrop = surface('dialog-overlay');
		expect(getComputedStyle(backdrop).transitionDuration).toBe('0.41s');
		expect(getComputedStyle(panel).transitionDuration).toBe('0.14s');
		expect(['none', 'blur(0px)']).toContain(getComputedStyle(panel).filter);
		flushSync(() => view.component.reduce());
		await frame();
		expect(panel.dataset.bedrockMotion).toBe('reduced');
		expect(backdrop.dataset.bedrockMotion).toBe('reduced');
		expect(getComputedStyle(panel).transitionDuration).toBe('0s');
	});

	it('clears the dialog backdrop blur before removal without crossfading the filtered layer', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'Open motion dialog' }).click();
		const backdrop = surface('dialog-overlay');
		const blurTransition = () =>
			backdrop
				.getAnimations()
				.find(
					(animation) =>
						animation instanceof CSSTransition && animation.transitionProperty === 'backdrop-filter'
				);
		const enter = blurTransition();
		expect(enter).toBeDefined();
		enter!.pause();
		enter!.currentTime = 100;
		const blur = Number.parseFloat(getComputedStyle(backdrop).backdropFilter.slice(5));
		expect(blur).toBeGreaterThan(0);
		expect(blur).toBeLessThan(4);
		expect(getComputedStyle(backdrop).opacity).toBe('1');
		enter!.finish();
		await expect.poll(() => backdrop.getAnimations().length).toBe(0);

		flushSync(() =>
			surface('dialog-content')
				.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')!
				.click()
		);
		await frame();
		const exit = blurTransition();
		expect(exit).toBeDefined();
		const closingAnimations = backdrop.getAnimations();
		for (const animation of closingAnimations) {
			animation.pause();
			animation.currentTime = 175;
		}
		expect(getComputedStyle(backdrop).backdropFilter).toBe('blur(0px)');
		expect(getComputedStyle(backdrop).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(backdrop).opacity).toBe('1');
		for (const animation of closingAnimations) animation.finish();
		await expect.poll(() => backdrop.isConnected).toBe(false);
	});

	it('keeps labels sharp and only assigns stagger to later decorative icons', async () => {
		const view = await render(Fixture, { motion: 'stagger' });
		await view.getByRole('button', { name: 'Open motion menu' }).click();
		const panel = surface('dropdown-menu-content');
		const items = [...panel.querySelectorAll<HTMLElement>('[role="menuitem"]')];
		expect(items).toHaveLength(3);
		expect(items[0].querySelector('[data-menu-motion-icon]')).toBeNull();
		expect(items[1].querySelector('[data-menu-motion-icon]')).not.toBeNull();
		for (const item of items) {
			expect(getComputedStyle(item).opacity).toBe('1');
			expect(getComputedStyle(item).filter).toBe('none');
		}
		items[1].focus();
		await frame();
		expect(panel.hasAttribute('data-motion-settled')).toBe(true);
		expect(items[1].querySelector('svg')!.getAnimations()).toHaveLength(0);
	});
	it('uses the Bedrock viewport through the public navigation root with one opening fade', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'First motion navigation' }).click();
		const viewport = surface('navigation-menu-viewport');
		const first = surface('navigation-menu-content');
		expect(viewport.classList.contains('motion-popover')).toBe(true);
		expect(viewport.dataset.bedrockMotion).toBe('full');
		expect(viewport.contains(first)).toBe(true);
		expect(first.hasAttribute('data-motion')).toBe(false);
		expect(getComputedStyle(first).opacity).toBe('1');
		expect(getComputedStyle(first).animationName).toBe('none');
		await view.getByRole('button', { name: 'Second motion navigation' }).click();
		await frame();
		const second = viewport.querySelector<HTMLElement>(
			'[data-state="open"][data-slot="navigation-menu-content"]'
		)!;
		expect(second.textContent).toContain('Second destination');
		expect(second.dataset.motion).toBe('from-end');
		expect(first.inert).toBe(true);
		expect(new DOMMatrixReadOnly(getComputedStyle(second).transform).a).toBe(1);
		await view.getByRole('button', { name: 'First motion navigation' }).click();
		await frame();
		const reopened = viewport.querySelector<HTMLElement>(
			'[data-state="open"][data-slot="navigation-menu-content"]'
		)!;
		expect(reopened.textContent).toContain('First destination');
		expect(reopened.dataset.motion).toBe('from-start');
		expect(
			viewport.querySelectorAll('[data-state="open"][data-slot="navigation-menu-content"]')
		).toHaveLength(1);

		flushSync(() => view.component.reduce());
		await frame();
		expect(viewport.dataset.bedrockMotion).toBe('reduced');
		expect(reopened.dataset.bedrockMotion).toBe('reduced');
		expect(getComputedStyle(viewport).transitionDuration).toBe('0s');
	});
});
