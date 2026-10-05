import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './swap-focus.test.svelte';

afterEach(cleanup);
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
function expectCurrentOwner(container: Element, value: number) {
	const copies = [...container.querySelectorAll<HTMLElement>('[data-slot="swap-copy"]')];
	const current = copies.filter((copy) => !copy.inert);
	expect(current).toHaveLength(1);
	expect(current[0].querySelector('[data-current]')?.getAttribute('data-current')).toBe(
		String(value)
	);
	for (const copy of copies.filter((copy) => copy.inert)) {
		expect(copy.getAttribute('aria-hidden')).toBe('true');
	}
}

describe('Swap retained exits', () => {
	it('retires old controls and transfers owned focus to the current action', async () => {
		const view = await render(Fixture, { props: { value: 0 } });
		const old = view.container.querySelector<HTMLButtonElement>('[data-current="0"]')!;
		old.focus();
		await view.rerender({ value: 1 });
		await nextFrame();
		expect(old.closest('[data-slot="swap-copy"]')?.hasAttribute('inert')).toBe(true);
		expect(old.closest('[data-slot="swap-copy"]')?.getAttribute('aria-hidden')).toBe('true');
		expect(document.activeElement).toBe(view.container.querySelector('[data-current="1"]'));
	});
	it('does not steal focus outside the replaced content during rapid updates', async () => {
		const view = await render(Fixture, { props: { value: 0 } });
		const outside = view.container.querySelector<HTMLButtonElement>('[data-outside]')!;
		outside.focus();
		for (const value of [1, 2, 3, 2, 4]) {
			await view.rerender({ value });
			expectCurrentOwner(view.container, value);
			expect(document.activeElement).toBe(outside);
		}
		// Delayed intro callbacks must never reactivate a retired copy.
		await nextFrame();
		await nextFrame();
		expectCurrentOwner(view.container, 4);
		expect(document.activeElement).toBe(outside);
	});
	it('retargets owned focus to the latest copy through rapid replacements', async () => {
		const view = await render(Fixture, { props: { value: 0 } });
		view.container.querySelector<HTMLButtonElement>('[data-current="0"]')!.focus();
		for (const value of [1, 2, 3]) {
			await view.rerender({ value });
			expectCurrentOwner(view.container, value);
			expect(document.activeElement).toBe(
				view.container.querySelector(`[data-current="${value}"]`)
			);
		}
		await nextFrame();
		await nextFrame();
		expectCurrentOwner(view.container, 3);
		expect(document.activeElement).toBe(view.container.querySelector('[data-current="3"]'));
	});
});
