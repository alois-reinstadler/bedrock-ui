import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './list.test.svelte';

afterEach(() => cleanup());

describe('List', () => {
	it('selects ordered and unordered elements and forwards start', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('ol')?.getAttribute('start')).toBe('3');
		expect(view.container.querySelectorAll('ul')).toHaveLength(3);
	});

	it('supports dividers and marker replacement icons', async () => {
		const view = await render(Fixture);
		const divided = [...view.container.querySelectorAll('[data-slot="list"]')].find((list) =>
			list.classList.contains('divide-y')
		);
		expect(divided).not.toBeUndefined();
		const iconItem = view.container.querySelector(
			'[data-slot="list-item"]:has([data-slot="icon"])'
		);
		expect(iconItem?.classList.contains('list-none')).toBe(true);
	});
});
