import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './field-status.test.svelte';

afterEach(() => cleanup());

describe('FieldStatus', () => {
	it('uses the status role, forwards id, and hides its icon from assistive technology', async () => {
		const view = await render(Fixture);
		const error = view.container.querySelector('#field-error');

		expect(error?.getAttribute('role')).toBe('alert');
		expect(error?.querySelector('[data-slot="icon"]')?.getAttribute('aria-hidden')).toBe('true');
		expect(view.container.querySelector('[role="status"]')?.textContent).toContain(
			'The value is available.'
		);
	});

	it('renders nothing without content and supports hiding the icon', async () => {
		const view = await render(Fixture);
		const statuses = view.container.querySelectorAll('[data-slot="field-status"]');

		expect(statuses).toHaveLength(2);
		expect(statuses[1]?.querySelector('[data-slot="icon"]')).toBeNull();
	});
});
