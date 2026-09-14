import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './astra.test.svelte';

afterEach(() => cleanup());

describe('Astra CSS wrapper contracts', () => {
	it('activates exactly once for pointer, Enter and Space', async () => {
		const onactivate = vi.fn();
		const view = await render(Fixture, { onactivate });
		const button = view.getByTestId('astra-button');
		await button.click();
		expect(onactivate).toHaveBeenCalledTimes(1);
		await userEvent.keyboard('{Enter}');
		expect(onactivate).toHaveBeenCalledTimes(2);
		await userEvent.keyboard(' ');
		expect(onactivate).toHaveBeenCalledTimes(3);
	});

	it('keeps disabled controls inert', async () => {
		const onactivate = vi.fn();
		const view = await render(Fixture, { disabled: true, onactivate });
		const button = view.container.querySelector<HTMLButtonElement>('button')!;
		expect(button.disabled).toBe(true);
		button.click();
		button.focus();
		await userEvent.keyboard('{Enter} ');
		expect(onactivate).not.toHaveBeenCalled();
		expect(document.activeElement).not.toBe(button);
	});

	it('forwards refs, consumer attachments, pointer handlers and non-motion styles', async () => {
		const onattach = vi.fn();
		const ondetach = vi.fn();
		const onpointer = vi.fn();
		const view = await render(Fixture, { onattach, ondetach, onpointer });
		const button = view.container.querySelector<HTMLButtonElement>('button')!;
		const panel = view.container.querySelector<HTMLDivElement>('[data-testid="astra-panel"]')!;
		await expect.poll(() => view.component.getRefs()).toEqual([button, panel]);
		expect(onattach).toHaveBeenCalledWith(button);
		expect(onattach).toHaveBeenCalledWith(panel);
		button.dispatchEvent(new PointerEvent('pointerenter'));
		expect(onpointer).toHaveBeenCalledTimes(1);
		expect(button.style.color).toBe('rgb(12, 34, 56)');
		expect(button.style.getPropertyValue('--consumer-token').trim()).toBe('7');
		expect(panel.style.padding).toBe('13px');
		await cleanup();
		expect(ondetach).toHaveBeenCalledTimes(onattach.mock.calls.length);
	});

	it('renders links with native keyboard activation and forwards their DOM ref', async () => {
		const onactivate = vi.fn();
		const view = await render(Fixture, { href: '#astra-destination', onactivate });
		const link = view.container.querySelector<HTMLAnchorElement>('a')!;
		expect(link.getAttribute('href')).toBe('#astra-destination');
		await expect.poll(() => view.component.getRefs()[0]).toBe(link);
		link.focus();
		await userEvent.keyboard('{Enter}');
		expect(onactivate).toHaveBeenCalledTimes(1);
		await userEvent.keyboard(' ');
		expect(onactivate).toHaveBeenCalledTimes(1);
	});
});

describe('Astra provider policy', () => {
	it('settles CSS movement when its provider changes after mount', async () => {
		const { default: PolicyFixture } = await import('./astra-policy.test.svelte');
		const view = await render(PolicyFixture);
		const panel = view.container.querySelector<HTMLElement>('[data-testid="policy-panel"]')!;
		const translation = () => Number.parseFloat(getComputedStyle(panel).translate) || 0;
		await expect.poll(translation).toBe(32);
		await view.getByRole('button', { name: 'Change policy' }).click();
		await expect.poll(translation).toBe(0);
		await view.getByRole('button', { name: 'Change policy' }).click();
		await expect.poll(translation).toBe(32);
	});
});
