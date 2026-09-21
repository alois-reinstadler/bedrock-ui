import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './field-error.test.svelte';

afterEach(() => cleanup());

describe('FieldError validation presence', () => {
	it('does not insert an empty alert for multiple errors without messages', async () => {
		const view = await render(Fixture, { props: { errors: [{}, { message: '' }] } });
		expect(view.container.querySelector('[role="alert"]')).toBeNull();
		expect(
			view.container.querySelector('[data-testid="field-stack"]')?.getBoundingClientRect().height
		).toBe(56);
	});

	it('uses a single message without an empty list when other errors have no message', async () => {
		const view = await render(Fixture, {
			props: { errors: [{}, { message: 'Enter your email address.' }] }
		});
		const alert = view.container.querySelector('[role="alert"]');
		expect(alert?.textContent).toContain('Enter your email address.');
		expect(alert?.querySelector('ul')).toBeNull();
	});

	it('keeps a list when multiple visible errors remain', async () => {
		const view = await render(Fixture, {
			props: { errors: [{ message: 'Enter an email.' }, {}, { message: 'Use a work address.' }] }
		});
		expect(view.container.querySelectorAll('li')).toHaveLength(2);
	});
});
