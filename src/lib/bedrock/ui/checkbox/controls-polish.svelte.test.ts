import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './controls-polish.test.svelte';

afterEach(() => cleanup());

function element<T extends HTMLElement>(container: Element, selector: string): T {
	const node = container.querySelector<T>(selector);
	if (!node) throw new Error(`Missing control: ${selector}`);
	return node;
}

function key(node: HTMLElement, key: string) {
	node.focus();
	flushSync(() => node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })));
}

describe('Control polish', () => {
	it('keeps checkbox state and form submission immediate while the Lucide stroke draws', async () => {
		const view = await render(Fixture);
		const checkbox = element<HTMLButtonElement>(view.container, '[aria-label="Consent"]');
		flushSync(() => checkbox.click());

		expect(checkbox.getAttribute('aria-checked')).toBe('true');
		expect(new FormData(element<HTMLFormElement>(view.container, 'form')).has('consent')).toBe(
			true
		);
		const paths = view.container.querySelectorAll<SVGPathElement>(
			'[data-slot="checkbox-check"] path'
		);
		expect(paths).toHaveLength(2);
		for (const path of paths) {
			expect(path.closest('svg')?.classList.contains('lucide-check')).toBe(true);
			const animation = path.getAnimations()[0];
			expect(animation).toBeDefined();
			animation.pause();
			animation.currentTime = 0;
			expect(getComputedStyle(path).strokeDashoffset).toBe('-24px');
			animation.finish();
			expect(getComputedStyle(path).strokeDashoffset).toBe('0px');
		}

		flushSync(() => checkbox.click());
		expect(checkbox.getAttribute('aria-checked')).toBe('false');
		expect(view.container.querySelector('[data-slot="checkbox-check"]')).toBeNull();
	});

	it('settles a running stroke immediately when application motion is reduced', async () => {
		const view = await render(Fixture);
		flushSync(() => element<HTMLButtonElement>(view.container, '[aria-label="Consent"]').click());
		const path = view.container.querySelector<SVGPathElement>('[data-slot="checkbox-check"] path')!;
		const animation = path.getAnimations()[0];
		animation.pause();
		animation.currentTime = 50;
		flushSync(() => element<HTMLButtonElement>(view.container, 'button').click());

		expect(getComputedStyle(path).animationName).toBe('none');
		expect(getComputedStyle(path).strokeDashoffset).toBe('0px');
		const track = element(view.container, '[data-testid="scalar"] [data-slot="slider-track"]');
		expect(getComputedStyle(track).transitionDuration).toBe('0s');
	});

	it('preserves scalar, range, vertical and disabled keyboard behavior', async () => {
		const view = await render(Fixture);
		const scalar = element(view.container, '[data-testid="scalar"] [role="slider"]');
		key(scalar, 'ArrowRight');
		expect(scalar.getAttribute('aria-valuenow')).toBe('41');
		key(scalar, 'End');
		expect(scalar.getAttribute('aria-valuenow')).toBe('100');

		const thumbs = view.container.querySelectorAll<HTMLElement>(
			'[data-testid="range"] [role="slider"]'
		);
		key(thumbs[0], 'ArrowRight');
		expect(thumbs[0].getAttribute('aria-valuenow')).toBe('21');
		expect(thumbs[1].getAttribute('aria-valuenow')).toBe('80');

		const vertical = element(view.container, '[data-testid="vertical"] [role="slider"]');
		key(vertical, 'ArrowUp');
		expect(vertical.getAttribute('aria-valuenow')).toBe('31');
		expect(vertical.getAttribute('aria-orientation')).toBe('vertical');

		const disabled = element(view.container, '[data-testid="disabled"] [role="slider"]');
		key(disabled, 'ArrowRight');
		expect(disabled.getAttribute('aria-valuenow')).toBe('50');
		expect(disabled.hasAttribute('data-disabled')).toBe(true);
	});
});
