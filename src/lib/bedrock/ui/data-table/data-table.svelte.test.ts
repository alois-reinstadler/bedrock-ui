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

	it('renders identifier, badge, and split currency cells', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('.font-mono')?.textContent).toContain('A-1');
		expect(view.container.querySelector('[data-slot="badge"]')?.textContent).toContain('offen');
		expect(view.container.textContent).toContain('EUR');
	});

	it('offers a show-all CTA on empty views and roving tabindex on tabs', async () => {
		const view = await render(Fixture);
		button(view.container, 'Leer').click();
		await Promise.resolve();
		const cta = button(view.container, 'Alle anzeigen');
		expect(cta.textContent).toContain('3');
		const tabs = [...view.container.querySelectorAll('[role="tab"]')];
		expect(tabs.filter((tab) => tab.getAttribute('tabindex') === '0')).toHaveLength(1);
		cta.click();
		await Promise.resolve();
		expect(view.container.textContent).toContain('A-1');
	});
});
