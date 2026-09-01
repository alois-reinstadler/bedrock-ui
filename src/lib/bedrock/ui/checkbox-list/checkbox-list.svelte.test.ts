import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './checkbox-list.test.svelte';

afterEach(() => cleanup());

describe('CheckboxList', () => {
	it('labels the group and renders descriptions and dividers', async () => {
		const view = await render(Fixture);
		const group = view.container.querySelector('[role="group"]')!;
		const label = document.getElementById(group.getAttribute('aria-labelledby')!);

		expect(label?.textContent).toBe('Sample contents');
		expect(group.textContent).toContain('Marked face images');
		expect(group.className).toContain('divide-y');
	});

	it('toggles rows into the bound array', async () => {
		const view = await render(Fixture);
		const checkbox = view.container.querySelector<HTMLElement>('[role="checkbox"]')!;
		checkbox.click();
		await Promise.resolve();

		expect(view.container.querySelector('[data-testid="value"]')?.textContent).toBe('photos');
		checkbox.click();
		await Promise.resolve();
		expect(view.container.querySelector('[data-testid="value"]')?.textContent).toBe('');
	});

	it('blocks a disabled item', async () => {
		const view = await render(Fixture);
		const disabled = view.container.querySelectorAll<HTMLElement>('[role="checkbox"]')[2]!;
		expect(disabled.getAttribute('data-disabled')).not.toBeNull();
		disabled.click();
		await Promise.resolve();
		expect(view.container.querySelector('[data-testid="value"]')?.textContent).toBe('');
	});
});
