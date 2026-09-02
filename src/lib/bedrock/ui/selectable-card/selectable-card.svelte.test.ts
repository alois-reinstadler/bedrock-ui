import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
import Fixture from './selectable-card.test.svelte';

afterEach(() => cleanup());

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

function parts(container: Element) {
	const card = container.querySelector<HTMLElement>('[data-slot="selectable-card"]');
	const trigger = container.querySelector<HTMLButtonElement>(
		'[data-slot="selectable-card-trigger"]'
	);
	const bound = container.querySelector<HTMLElement>('[data-testid="bound-value"]');
	if (!card || !trigger || !bound) throw new Error('SelectableCard parts not found');
	return { card, trigger, bound };
}

describe('SelectableCard', () => {
	it('toggles the bound value and aria-checked on click', async () => {
		const changes: boolean[] = [];
		const view = await render(Fixture, {
			props: { onSelectedChange: (value: boolean) => changes.push(value) }
		});
		const { trigger, bound } = parts(view.container);

		expect(trigger.getAttribute('aria-checked')).toBe('false');
		trigger.click();
		await settle();
		expect(trigger.getAttribute('aria-checked')).toBe('true');
		expect(bound.textContent).toBe('true');

		trigger.click();
		await settle();
		expect(trigger.getAttribute('aria-checked')).toBe('false');
		expect(bound.textContent).toBe('false');
		expect(changes).toEqual([true, false]);
	});

	it('toggles with the Space key', async () => {
		const view = await render(Fixture, { props: {} });
		const { trigger, bound } = parts(view.container);

		trigger.focus();
		await userEvent.keyboard(' ');
		await settle();
		expect(trigger.getAttribute('aria-checked')).toBe('true');
		expect(bound.textContent).toBe('true');
	});

	it('shows the inset selection ring while keeping the resting shadow', async () => {
		const view = await render(Fixture, { props: {} });
		const { card, trigger } = parts(view.container);

		expect(card.dataset.selected).toBeUndefined();
		trigger.click();
		await settle();
		expect(card.dataset.selected).toBe('true');
		expect(card.className).toContain('ring-2');
		expect(card.className).toContain('ring-primary');
		expect(card.className).toContain('ring-inset');
		expect(card.className).toContain('shadow-sm');
	});

	it('blocks toggling when disabled', async () => {
		const view = await render(Fixture, { props: { disabled: true } });
		const { trigger, bound } = parts(view.container);

		expect(trigger.disabled).toBe(true);
		trigger.click();
		await settle();
		expect(trigger.getAttribute('aria-checked')).toBe('false');
		expect(bound.textContent).toBe('false');
	});
});
