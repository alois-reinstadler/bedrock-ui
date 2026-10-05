import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ErrorPage from './+error.svelte';

afterEach(() => cleanup());

describe('shared error recovery', () => {
	it('keeps unexpected error details private and provides retry and safe navigation', async () => {
		const view = await render(ErrorPage, {
			error: { status: 500, message: 'private backend exception' }
		});
		expect(view.container.textContent).toContain('Error 500');
		expect(view.container.textContent).toContain('Unable to load this page');
		expect(view.container.textContent).not.toContain('private backend exception');
		expect(view.container.querySelector('button')?.textContent).toBe('Try again');
		expect(view.container.querySelector('a[href="/"]')?.textContent).toBe('Go home');
	});
});
