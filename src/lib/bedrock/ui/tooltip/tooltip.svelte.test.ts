import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Fixture from './tooltip.test.svelte';

afterEach(() => cleanup());

async function assertDescription(trigger: HTMLElement, text: string, expectedId?: string) {
	await vi.waitFor(() => {
		const id = trigger.getAttribute('aria-describedby');
		expect(id).toBeTruthy();
		if (expectedId) expect(id).toBe(expectedId);
		const content = document.getElementById(id!);
		expect(content?.getAttribute('role')).toBe('tooltip');
		expect(content?.textContent).toContain(text);
	});
	return trigger.getAttribute('aria-describedby')!;
}

describe('Tooltip description relationship', () => {
	it('links keyboard focus to its description and clears it on Escape and blur', async () => {
		const view = await render(Fixture);
		const trigger = view.container.querySelector<HTMLButtonElement>('button')!;
		trigger.focus();
		const id = await assertDescription(trigger, 'First description');
		await userEvent.keyboard('{Escape}');
		await vi.waitFor(() => expect(trigger.hasAttribute('aria-describedby')).toBe(false));
		expect(document.activeElement).toBe(trigger);
		await vi.waitFor(() => expect(document.getElementById(id)).toBeNull());
		await userEvent.tab();
		const second = view.container.querySelectorAll<HTMLButtonElement>('button')[1];
		await assertDescription(second, 'Second description', 'caller-tooltip-id');
		await userEvent.tab();
		await vi.waitFor(() => expect(second.hasAttribute('aria-describedby')).toBe(false));
	});

	it('preserves caller ids, custom content props and separate instance relationships on hover', async () => {
		const view = await render(Fixture);
		const buttons = view.container.querySelectorAll<HTMLButtonElement>('button');
		await page.getByRole('button', { name: 'First hint', exact: true }).hover();
		const firstId = await assertDescription(buttons[0], 'First description');
		await page.getByRole('button', { name: 'Second hint', exact: true }).hover();
		const secondId = await assertDescription(buttons[1], 'Second description', 'caller-tooltip-id');
		expect(firstId).not.toBe(secondId);
		await vi.waitFor(() => expect(buttons[0].hasAttribute('aria-describedby')).toBe(false));
		await page.getByRole('button', { name: 'Custom hint', exact: true }).hover();
		await assertDescription(buttons[2], 'Custom description', 'custom-tooltip-id');
		expect(document.getElementById('custom-tooltip-id')?.dataset.testid).toBe('custom-content');
		await page.getByRole('button', { name: 'Outside tooltip', exact: true }).hover();
		await vi.waitFor(() => expect(buttons[2].hasAttribute('aria-describedby')).toBe(false));
	});
});
