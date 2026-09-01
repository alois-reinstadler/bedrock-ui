import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './date-range-input.test.svelte';
afterEach(() => cleanup());
describe('DateRangeInput', () => {
	it('applies a preset', async () => {
		const view = await render(Fixture);
		view.container.querySelector<HTMLButtonElement>('[aria-label="Open calendar"]')?.click();
		await Promise.resolve();
		const preset = [...document.querySelectorAll('button')].find(
			(button) => button.textContent === 'Next week'
		) as HTMLButtonElement;
		expect(preset).toBeDefined();
		preset.click();
		await Promise.resolve();
		expect(view.container.textContent).toContain('2026-09-07–2026-09-13');
	});
});
