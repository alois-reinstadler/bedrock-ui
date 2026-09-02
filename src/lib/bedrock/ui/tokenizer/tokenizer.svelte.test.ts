import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './tokenizer.test.svelte';

afterEach(() => cleanup());

type View = { container: Element };

function input(view: View): HTMLInputElement | null {
	return view.container.querySelector<HTMLInputElement>('[data-slot="tokenizer-input"]');
}

function type(field: HTMLInputElement, text: string) {
	field.focus();
	field.value = text;
	field.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

function key(target: Element, name: string) {
	target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
}

const value = (view: View) => view.container.querySelector('output[aria-label="Value"]');
const change = (view: View) => view.container.querySelector('output[aria-label="Change"]');
const status = (view: View) => view.container.querySelector('[role="status"]');
const listOptions = (view: View) =>
	view.container.querySelectorAll('[data-slot="tokenizer-option"]');

describe('Tokenizer', () => {
	it('adds the highlighted option on Enter and announces it', async () => {
		const view = await render(Fixture);
		const field = input(view);
		expect(field).not.toBeNull();
		type(field!, 'ada');
		await expect.poll(() => listOptions(view).length).toBe(1);
		key(field!, 'Enter');
		await expect.poll(() => value(view)?.textContent).toBe('ada');
		expect(change(view)?.textContent).toBe('add:ada');
		expect(status(view)?.textContent).toBe('Added Ada Lovelace');
	});

	it('removes the last chip on Backspace in an empty input and announces it', async () => {
		const view = await render(Fixture, { initial: ['ada', 'grace'] });
		const field = input(view);
		key(field!, 'Backspace');
		await expect.poll(() => value(view)?.textContent).toBe('ada');
		expect(change(view)?.textContent).toBe('remove:grace');
		expect(status(view)?.textContent).toBe('Removed Grace Hopper');
	});

	it('supports roving focus across chips and removal from a focused chip', async () => {
		const view = await render(Fixture, { initial: ['ada', 'grace'] });
		const field = input(view);
		field!.focus();

		key(field!, 'ArrowLeft');
		await expect.poll(() => document.activeElement?.textContent).toContain('Grace');

		key(document.activeElement!, 'ArrowLeft');
		await expect.poll(() => document.activeElement?.textContent).toContain('Ada');

		key(document.activeElement!, 'ArrowRight');
		await expect.poll(() => document.activeElement?.textContent).toContain('Grace');

		key(document.activeElement!, 'Backspace');
		await expect.poll(() => value(view)?.textContent).toBe('ada');
		await expect.poll(() => document.activeElement?.textContent).toContain('Ada');
	});

	it('creates free-text entries when create is enabled', async () => {
		const view = await render(Fixture, { create: true, useOptions: false });
		const field = input(view);
		type(field!, 'urgent');
		await expect.poll(() => listOptions(view).length).toBe(1);
		expect(listOptions(view)[0].textContent).toContain('Create "urgent"');
		key(field!, 'Enter');
		await expect.poll(() => value(view)?.textContent).toBe('urgent');
		expect(change(view)?.textContent).toBe('create:urgent');
	});

	it('hides the input at maxItems', async () => {
		const view = await render(Fixture, { maxItems: 1, initial: ['ada'] });
		expect(input(view)).toBeNull();
		expect(view.container.querySelectorAll('[data-slot="token"]')).toHaveLength(1);
	});
});
