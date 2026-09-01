import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './timestamp.test.svelte';

afterEach(() => cleanup());

const fixedDate = new Date('2026-09-01T12:00:00.000Z');

describe('Timestamp', () => {
	it('renders absolute dates with the en-US default and a datetime attribute', async () => {
		const view = await render(Fixture);
		const [valid, invalid] = view.container.querySelectorAll('time');

		expect(valid.textContent).toBe(
			new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
				fixedDate
			)
		);
		expect(valid.getAttribute('datetime')).toBe(fixedDate.toISOString());
		expect(invalid.textContent).toBe('–');
		expect(invalid.hasAttribute('datetime')).toBe(false);
	});

	it('supports Austrian German as an explicit locale override', async () => {
		const view = await render(Fixture, { locale: 'de-AT' });
		const valid = view.container.querySelector('time');

		expect(valid?.textContent).toBe(
			new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium', timeStyle: 'short' }).format(
				fixedDate
			)
		);
	});
});
