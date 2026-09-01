import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './icon-button.test.svelte';

afterEach(() => cleanup());

describe('IconButton', () => {
	it('names the control, maps sizes, and keeps a 44px tap target', async () => {
		const view = await render(Fixture);
		const buttons = view.container.querySelectorAll<HTMLButtonElement>('[data-slot="icon-button"]');

		expect(buttons[0]?.getAttribute('aria-label')).toBe('Search records');
		expect(buttons[0]?.classList.contains('size-6')).toBe(true);
		expect(buttons[0]?.classList.contains('tap-target')).toBe(true);
		expect(buttons[1]?.classList.contains('size-9')).toBe(true);
		expect(buttons[1]?.querySelector('[data-slot="icon"]')?.getAttribute('aria-hidden')).toBe(
			'true'
		);
	});

	it('mounts tooltip semantics and forwards clicks', async () => {
		const view = await render(Fixture);
		const buttons = view.container.querySelectorAll<HTMLButtonElement>('[data-slot="icon-button"]');

		expect(buttons).toHaveLength(2);
		buttons[0]?.click();
		await Promise.resolve();
		expect(view.container.querySelector('output')?.textContent).toBe('1');
	});
});
