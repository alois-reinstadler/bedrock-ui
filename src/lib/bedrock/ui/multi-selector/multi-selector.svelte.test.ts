import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './multi-selector.test.svelte';

afterEach(() => cleanup());

type View = { container: Element };

const content = () => document.querySelector('[data-slot="multi-selector-content"]');

function item(label: string): HTMLElement {
	const match = [
		...document.querySelectorAll<HTMLElement>('[data-slot="multi-selector-item"]')
	].find((entry) => entry.textContent?.includes(label));
	if (!match) throw new Error(`Item not found: ${label}`);
	return match;
}

function trigger(view: View): HTMLButtonElement {
	const match = view.container.querySelector<HTMLButtonElement>(
		'[data-slot="multi-selector-trigger"]'
	);
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

describe('MultiSelector', () => {
	it('keeps the popover open across toggles and updates the value array', async () => {
		const view = await render(Fixture);
		await openSelector(view);

		item('Red').click();
		await expect.poll(() => value(view)?.textContent).toBe('red');
		expect(content()).not.toBeNull();

		item('Green').click();
		await expect.poll(() => value(view)?.textContent).toBe('red,green');

		item('Red').click();
		await expect.poll(() => value(view)?.textContent).toBe('green');
		expect(content()).not.toBeNull();
	});

	it('summarizes the selection as a count by default', async () => {
		const view = await render(Fixture, { initial: ['red', 'green'] });
		expect(trigger(view).textContent).toContain('2 selected');
	});

	it('summarizes the selection as joined labels', async () => {
		const view = await render(Fixture, { triggerDisplay: 'labels', initial: ['red', 'blue'] });
		expect(trigger(view).textContent).toContain('Red, Blue');
	});

	it('renders badge tokens with an overflow indicator', async () => {
		const view = await render(Fixture, {
			triggerDisplay: 'badges',
			maxBadges: 2,
			initial: ['red', 'green', 'blue']
		});
		const tokens = trigger(view).querySelectorAll('[data-slot="token"]');
		expect(tokens).toHaveLength(2);
		expect(trigger(view).textContent).toContain('+1');
	});

	it('select-all shows a partial state, selects all enabled options, then clears them', async () => {
		const view = await render(Fixture, { selectAll: true, initial: ['red'] });
		await openSelector(view);

		const row = () => document.querySelector('[data-slot="multi-selector-select-all"]');
		const indicator = () => row()?.querySelector('span[aria-hidden="true"]');

		// Partial: filled indicator without the check icon.
		expect(indicator()?.className).toContain('bg-primary');
		expect(indicator()?.querySelector('[data-slot="icon"]')).toBeNull();

		(row() as HTMLElement).click();
		// The disabled option stays untouched.
		await expect.poll(() => value(view)?.textContent).toBe('red,green,blue');
		await expect.poll(() => indicator()?.querySelector('[data-slot="icon"]')).not.toBeNull();

		(row() as HTMLElement).click();
		await expect.poll(() => value(view)?.textContent).toBe('');
		expect(content()).not.toBeNull();
	});
});
