import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './token.test.svelte';

afterEach(() => cleanup());

function token(view: Awaited<ReturnType<typeof render>>, label: string): HTMLElement {
	const match = [...view.container.querySelectorAll<HTMLElement>('[data-slot="token"]')].find(
		(item) => item.textContent?.includes(label)
	);
	if (!match) throw new Error(`Token not found: ${label}`);
	return match;
}

describe('Token', () => {
	it('renders a span, button, or link according to its interaction props', async () => {
		const view = await render(Fixture);

		expect(token(view, 'Plain token').firstElementChild?.tagName).toBe('SPAN');
		expect(token(view, 'Clickable token').firstElementChild?.tagName).toBe('BUTTON');
		expect(token(view, 'Linked token').firstElementChild?.tagName).toBe('A');
	});

	it('applies color and size variants', async () => {
		const view = await render(Fixture);
		const body = token(view, 'Clickable token').firstElementChild;

		expect(body?.classList.contains('bg-blue-100')).toBe(true);
		expect(body?.classList.contains('h-5')).toBe(true);
	});

	it('keeps removal separate, labelled, and callable', async () => {
		const view = await render(Fixture);
		const removable = token(view, 'Removable token');
		const remove = removable.querySelector<HTMLButtonElement>(
			'button[aria-label="Remove Removable token"]'
		);

		expect(removable.firstElementChild?.contains(remove)).toBe(false);
		remove?.click();
		await Promise.resolve();
		expect(view.container.querySelector('output[aria-label="Removals"]')?.textContent).toBe('1');
	});

	it('blocks body and removal interaction when disabled', async () => {
		const view = await render(Fixture);
		const disabled = token(view, 'Disabled token');
		const body = disabled.firstElementChild as HTMLAnchorElement;
		const remove = disabled.querySelector<HTMLButtonElement>('button');

		expect(body.getAttribute('href')).toBeNull();
		expect(body.getAttribute('aria-disabled')).toBe('true');
		expect(remove?.disabled).toBe(true);
		body.click();
		remove?.click();
		await Promise.resolve();
		expect(view.container.querySelector('output[aria-label="Body clicks"]')?.textContent).toBe('0');
		expect(view.container.querySelector('output[aria-label="Removals"]')?.textContent).toBe('0');
	});
});
