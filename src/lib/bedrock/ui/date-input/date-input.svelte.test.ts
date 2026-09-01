import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './date-input.test.svelte';
afterEach(() => cleanup());
describe('DateInput', () => {
	it('renders segments, reports range validity, and opens its calendar', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelectorAll('[data-segment]').length).toBeGreaterThan(0);
		expect(view.container.querySelector('[aria-invalid="true"]')).not.toBeNull();
		const trigger = view.container.querySelector<HTMLButtonElement>('[aria-label="Open calendar"]');
		expect(trigger).not.toBeNull();
		trigger?.click();
		await Promise.resolve();
		expect(trigger?.getAttribute('aria-expanded')).toBe('true');
	});
});
