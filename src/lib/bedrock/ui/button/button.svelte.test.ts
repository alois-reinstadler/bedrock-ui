import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Button from './button.svelte';
import IconButton from '../icon-button/icon-button.svelte';

afterEach(() => cleanup());

describe('Button disabled link parity', () => {
	it('blocks a disabled link callback and cancels its activation', async () => {
		const onclick = vi.fn();
		const view = await render(Button, {
			props: { href: '#disabled', disabled: true, onclick, 'aria-label': 'Disabled action' }
		});
		const link = view.container.querySelector('a')!;
		const activation = new MouseEvent('click', { bubbles: true, cancelable: true });
		link.dispatchEvent(activation);
		expect(onclick).not.toHaveBeenCalled();
		expect(activation.defaultPrevented).toBe(true);
		expect(link.hasAttribute('href')).toBe(false);
		expect(link.tabIndex).toBe(-1);
		expect(link.getAttribute('aria-disabled')).toBe('true');
	});

	it('keeps explicit tabindex and aria props from re-enabling a disabled link', async () => {
		const view = await render(Button, {
			props: { href: '#disabled', disabled: true, tabindex: 0, 'aria-disabled': false }
		});
		const link = view.container.querySelector('a')!;
		expect(link.tabIndex).toBe(-1);
		expect(link.getAttribute('aria-disabled')).toBe('true');
	});

	it('also blocks disabled IconButton links with composed tooltip props', async () => {
		const onclick = vi.fn();
		const view = await render(IconButton, {
			props: {
				icon: 'search',
				label: 'Search',
				tooltip: 'Search records',
				href: '#disabled',
				disabled: true,
				onclick
			}
		});
		view.container.querySelector('a')!.click();
		expect(onclick).not.toHaveBeenCalled();
	});

	it('retains native Enter activation and event cancellation when enabled', async () => {
		const onclick = vi.fn((event: MouseEvent) => event.preventDefault());
		const view = await render(Button, {
			props: { href: '#enabled', onclick, 'aria-label': 'Enabled action' }
		});
		const link = view.container.querySelector('a')!;
		link.focus();
		await userEvent.keyboard('{Enter}');
		expect(onclick).toHaveBeenCalledTimes(1);
		expect(onclick.mock.calls[0][0].defaultPrevented).toBe(true);
		expect(link.getAttribute('href')).toBe('#enabled');
	});
});
