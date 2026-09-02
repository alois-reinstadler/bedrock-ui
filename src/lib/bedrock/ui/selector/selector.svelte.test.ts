import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './selector.test.svelte';

afterEach(() => cleanup());

type View = { container: Element };

const content = () => document.querySelector('[data-slot="selector-content"]');
const items = () => [...document.querySelectorAll<HTMLElement>('[data-slot="selector-item"]')];

function item(label: string): HTMLElement {
	const match = items().find((entry) => entry.textContent?.includes(label));
	if (!match) throw new Error(`Item not found: ${label}`);
	return match;
}

function trigger(view: View): HTMLButtonElement {
	const match = view.container.querySelector<HTMLButtonElement>('[data-slot="selector-trigger"]');
	if (!match) throw new Error('Trigger not found');
	return match;
}

async function openSelector(view: View): Promise<HTMLButtonElement> {
	const button = trigger(view);
	button.click();
	await expect.poll(content).not.toBeNull();
	return button;
}

const value = (view: View) => view.container.querySelector('output[aria-label="Value"]');

describe('Selector', () => {
	it('opens, selects an option, closes, and marks the selection checked on reopen', async () => {
		const view = await render(Fixture);
		await openSelector(view);
		item('Apple').click();
		await expect.poll(() => value(view)?.textContent).toBe('apple');
		await expect.poll(content).toBeNull();

		await openSelector(view);
		expect(item('Apple').dataset.checked).toBe('true');
		expect(item('Banana').dataset.checked).toBeUndefined();
		// The check indicator sits at the end of the row and is revealed via data-checked.
		expect(item('Apple').querySelector('.cn-command-item-indicator')).not.toBeNull();
	});

	it('renders group headings and separators', async () => {
		const view = await render(Fixture);
		await openSelector(view);
		expect(document.querySelector('[data-slot="command-group"]')?.textContent).toContain('Fruits');
		expect(document.querySelector('[data-slot="command-separator"]')).not.toBeNull();
	});

	it('filters options through the visible search input', async () => {
		const view = await render(Fixture, { searchable: true });
		await openSelector(view);
		const input = document.querySelector<HTMLInputElement>('[data-slot="command-input"]');
		expect(input).not.toBeNull();
		input!.value = 'ban';
		input!.dispatchEvent(new InputEvent('input', { bubbles: true }));
		await expect.poll(() => items().length).toBe(1);
		expect(item('Banana')).toBeDefined();
	});

	it('clears the value from the trigger clear button', async () => {
		const view = await render(Fixture, { clearable: true, initial: 'apple' });
		expect(trigger(view).textContent).toContain('Apple');
		const clear = view.container.querySelector<HTMLButtonElement>('[data-slot="selector-clear"]');
		expect(clear?.getAttribute('aria-label')).toBe('Clear selection');
		clear!.click();
		await expect.poll(() => value(view)?.textContent).toBe('');
		expect(trigger(view).textContent).toContain('Pick one');
	});

	it('blocks disabled options', async () => {
		const view = await render(Fixture);
		await openSelector(view);
		const durian = item('Durian');
		expect(durian.getAttribute('aria-disabled')).toBe('true');
		durian.click();
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(value(view)?.textContent).toBe('');
		expect(content()).not.toBeNull();
	});

	it('lets a custom option snippet replace the row content', async () => {
		const view = await render(Fixture, { custom: true });
		await openSelector(view);
		const row = item('Apple').querySelector('[data-testid="custom-option"]');
		expect(row?.textContent).toBe('*Apple*');
	});
});
