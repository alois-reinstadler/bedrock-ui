import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './data-table.test.svelte';

afterEach(() => cleanup());

function button(container: Element, text: string): HTMLButtonElement {
	const match = [...container.querySelectorAll('button')].find((item) =>
		item.textContent?.includes(text)
	);
	if (!match) throw new Error(`Button not found: ${text}`);
	return match;
}

describe('DataTable v2 shell', () => {
	it('shows raw view counts and keeps zero-count views clickable', async () => {
		const view = await render(Fixture);
		expect(button(view.container, 'Alle').textContent).toContain('3');
		expect(button(view.container, 'Offen').textContent).toContain('2');
		const empty = button(view.container, 'Leer');
		expect(empty.disabled).toBe(false);
		empty.click();
		await Promise.resolve();
		expect(view.container.textContent).toContain('Keine Ergebnisse.');
	});

	it('renders identifier, badge, split currency, and local density controls', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('.font-mono')?.textContent).toContain('A-1');
		expect(view.container.querySelector('[data-slot="badge"]')?.textContent).toContain('offen');
		expect(view.container.textContent).toContain('EUR');
		const comfortable = button(view.container, 'Komfortabel');
		comfortable.click();
		await Promise.resolve();
		expect(comfortable.getAttribute('aria-pressed')).toBe('true');
	});
});
