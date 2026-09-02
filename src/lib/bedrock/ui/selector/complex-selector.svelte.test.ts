import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './complex-selector.test.svelte';

afterEach(() => cleanup());

type View = { container: Element };

const content = () => document.querySelector('[data-slot="complex-selector-content"]');

function contentButton(text: string): HTMLButtonElement {
	const match = [...document.querySelectorAll('button')].find(
		(button) => button.textContent?.trim() === text
	);
	if (!match) throw new Error(`Button not found: ${text}`);
	return match;
}

async function openSelector(view: View): Promise<HTMLButtonElement> {
	const button = view.container.querySelector<HTMLButtonElement>(
		'[data-slot="complex-selector-trigger"]'
	);
	if (!button) throw new Error('Trigger not found');
	button.click();
	await expect.poll(content).not.toBeNull();
	return button;
}

describe('ComplexSelector', () => {
	it('passes the current value to the content snippet and commits updates', async () => {
		const view = await render(Fixture);
		await openSelector(view);
		expect(document.querySelector('output[aria-label="Draft"]')?.textContent).toBe('none');

		contentButton('Commit 42').click();
		await expect
			.poll(() => view.container.querySelector('output[aria-label="Value"]')?.textContent)
			.toBe('42');
		// The snippet re-renders with the committed value while the popover stays open.
		expect(document.querySelector('output[aria-label="Draft"]')?.textContent).toBe('42');
		expect(content()).not.toBeNull();
	});

	it('close() closes the popover and returns focus to the trigger', async () => {
		const view = await render(Fixture);
		const trigger = await openSelector(view);
		contentButton('Close').click();
		await expect.poll(content).toBeNull();
		await expect.poll(() => document.activeElement).toBe(trigger);
	});
});
