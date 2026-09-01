import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './date-time-input.test.svelte';
afterEach(() => cleanup());
describe('DateTimeInput', () => {
	it('renders date and time segments and opens the calendar', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('[data-segment="hour"]')).not.toBeNull();
		const trigger = view.container.querySelector<HTMLButtonElement>('[aria-label="Open calendar"]');
		expect(trigger).not.toBeNull();
		trigger?.click();
		await Promise.resolve();
		expect(trigger?.getAttribute('aria-expanded')).toBe('true');
	});
});
