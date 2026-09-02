import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './power-search.test.svelte';
import type { PowerSearchFilter } from './types.js';

afterEach(() => cleanup());

type View = { container: Element };

function input(view: View): HTMLInputElement {
	const field = view.container.querySelector<HTMLInputElement>('[data-slot="power-search-input"]');
	if (!field) throw new Error('PowerSearch input not found');
	return field;
}

function type(field: HTMLInputElement, text: string) {
	field.focus();
	field.value = text;
	field.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

function key(target: Element, name: string) {
	target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
}

const fieldOptions = (view: View) =>
	view.container.querySelectorAll('[data-slot="power-search-field-option"]');
const chips = (view: View) => view.container.querySelectorAll('[data-slot="power-search-token"]');
const filtersOf = (view: View): PowerSearchFilter[] =>
	JSON.parse(view.container.querySelector('output[aria-label="Filters"]')?.textContent ?? '[]');
const changeOf = (view: View) =>
	view.container.querySelector('output[aria-label="Change"]')?.textContent;
/** The builder popover portals to the body, so query the document. */
const builder = () => document.querySelector<HTMLElement>('[data-slot="power-search-builder"]');

function builderControl<T extends HTMLElement>(selector: string): T {
	const control = builder()?.querySelector<T>(selector);
	if (!control) throw new Error(`Builder control not found: ${selector}`);
	return control;
}

async function openBuilder(view: View, query: string) {
	const field = input(view);
	type(field, query);
	await expect.poll(() => fieldOptions(view).length).toBe(1);
	key(field, 'Enter');
	await expect.poll(() => builder()).not.toBeNull();
}

const stringFilter = (value: string): PowerSearchFilter => ({
	field: 'customer',
	operator: 'is',
	value: { type: 'string', value }
});

describe('PowerSearch', () => {
	it('opens the field menu while typing and filters it by the query', async () => {
		const view = await render(Fixture);
		expect(fieldOptions(view)).toHaveLength(0);
		type(input(view), 't');
		await expect.poll(() => fieldOptions(view).length).toBe(4); // Customer, Total, Status, Tags
		type(input(view), 'sta');
		await expect.poll(() => fieldOptions(view).length).toBe(1);
		expect(fieldOptions(view)[0].textContent).toContain('Status');
	});

	it('commits a string filter through the builder and reports the add', async () => {
		const view = await render(Fixture);
		await openBuilder(view, 'cust');
		const value = builderControl<HTMLInputElement>('[data-slot="power-search-value-string"]');
		type(value, 'Alpine');
		await expect
			.poll(() => builderControl<HTMLButtonElement>('[data-slot="power-search-apply"]').disabled)
			.toBe(false);
		builderControl<HTMLButtonElement>('[data-slot="power-search-apply"]').click();
		await expect.poll(() => filtersOf(view)).toEqual([stringFilter('Alpine')]);
		expect(changeOf(view)).toBe('add:0');
		expect(chips(view)).toHaveLength(1);
		expect(chips(view)[0].textContent).toContain('Customer is Alpine');
	});

	it('commits the typed value from the number editor', async () => {
		const view = await render(Fixture);
		await openBuilder(view, 'tot');
		const value = builder()!.querySelector<HTMLInputElement>('input:not([type="hidden"])');
		expect(value).not.toBeNull();
		value!.focus();
		value!.value = '42';
		value!.dispatchEvent(new Event('input', { bubbles: true }));
		value!.blur();
		await expect
			.poll(() => builderControl<HTMLButtonElement>('[data-slot="power-search-apply"]').disabled)
			.toBe(false);
		builderControl<HTMLButtonElement>('[data-slot="power-search-apply"]').click();
		await expect
			.poll(() => filtersOf(view))
			.toEqual([{ field: 'total', operator: 'eq', value: { type: 'number', value: 42 } }]);
		expect(changeOf(view)).toBe('add:0');
	});

	it('commits an enum filter when a value is selected', async () => {
		const view = await render(Fixture);
		await openBuilder(view, 'sta');
		const items = [...builder()!.querySelectorAll('[data-slot="power-search-enum-item"]')];
		const paid = items.find((item) => item.textContent?.includes('Paid'));
		expect(paid).not.toBeUndefined();
		(paid as HTMLElement).click();
		await expect
			.poll(() => filtersOf(view))
			.toEqual([{ field: 'status', operator: 'is', value: { type: 'enum', value: 'paid' } }]);
		expect(changeOf(view)).toBe('add:0');
	});

	it('removes a chip via its remove button and reports the index', async () => {
		const view = await render(Fixture, {
			initial: [
				stringFilter('Alpine'),
				{ field: 'status', operator: 'is', value: { type: 'enum', value: 'open' } }
			]
		});
		const remove = view.container.querySelector<HTMLButtonElement>(
			'[aria-label="Remove filter Customer"]'
		);
		expect(remove).not.toBeNull();
		remove!.click();
		await expect.poll(() => filtersOf(view).length).toBe(1);
		expect(filtersOf(view)[0].field).toBe('status');
		expect(changeOf(view)).toBe('remove:0');
	});

	it('reopens the builder from a chip and persists an operator change', async () => {
		const view = await render(Fixture, {
			initial: [{ field: 'total', operator: 'gt', value: { type: 'number', value: 10 } }]
		});
		(chips(view)[0] as HTMLElement).click();
		await expect.poll(() => builder()).not.toBeNull();
		const operator = builderControl<HTMLSelectElement>('select');
		expect(operator.value).toBe('gt');
		operator.value = 'lte';
		operator.dispatchEvent(new Event('change', { bubbles: true }));
		builderControl<HTMLButtonElement>('[data-slot="power-search-apply"]').click();
		await expect
			.poll(() => filtersOf(view))
			.toEqual([{ field: 'total', operator: 'lte', value: { type: 'number', value: 10 } }]);
		expect(changeOf(view)).toBe('edit:0');
	});

	it('removes the last filter on Backspace in an empty input', async () => {
		const view = await render(Fixture, {
			initial: [stringFilter('Alpine'), stringFilter('Borealis')]
		});
		key(input(view), 'Backspace');
		await expect.poll(() => filtersOf(view)).toEqual([stringFilter('Alpine')]);
		expect(changeOf(view)).toBe('remove:1');
	});

	it('clears every filter through the clear-all button', async () => {
		const view = await render(Fixture, {
			initial: [stringFilter('Alpine'), stringFilter('Borealis')]
		});
		const clear = view.container.querySelector<HTMLButtonElement>(
			'[data-slot="power-search-clear"]'
		);
		expect(clear).not.toBeNull();
		clear!.click();
		await expect.poll(() => filtersOf(view)).toEqual([]);
		expect(changeOf(view)).toBe('remove:-1');
		expect(view.container.querySelector('[data-slot="power-search-clear"]')).toBeNull();
	});

	it('adds a free-text contains filter on Enter when no field matches', async () => {
		const view = await render(Fixture, { freeText: true });
		const field = input(view);
		type(field, 'zzz');
		await expect.poll(() => fieldOptions(view).length).toBe(0);
		key(field, 'Enter');
		await expect
			.poll(() => filtersOf(view))
			.toEqual([
				{ field: 'customer', operator: 'contains', value: { type: 'string', value: 'zzz' } }
			]);
		expect(changeOf(view)).toBe('add:0');
		expect(field.value).toBe('');
	});

	it('renders the result count', async () => {
		const view = await render(Fixture, { resultCount: 7 });
		expect(
			view.container.querySelector('[data-slot="power-search-results"]')?.textContent
		).toContain('7 results');
	});
});
