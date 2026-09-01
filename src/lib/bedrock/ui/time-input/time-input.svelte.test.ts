import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './time-input.test.svelte';
afterEach(() => cleanup());
describe('TimeInput', () => {
	it('renders a disabled 12-hour field with day period', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('[data-segment="dayPeriod"]')).not.toBeNull();
		expect(view.container.querySelector('[data-disabled]')).not.toBeNull();
	});
});
