import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import LocalizedFixture from './data-table-localized.test.svelte';
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
		expect(button(view.container, 'All').textContent).toContain('3');
		expect(button(view.container, 'Offen').textContent).toContain('2');
		const empty = button(view.container, 'Leer');
		expect(empty.disabled).toBe(false);
		empty.click();
		await Promise.resolve();
		expect(view.container.textContent).toContain('No results.');
	});

	it('renders identifier, badge, and split currency cells', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('.font-code')?.textContent).toContain('A-1');
		expect(view.container.querySelector('[data-slot="badge"]')?.textContent).toContain('offen');
		expect(view.container.textContent).toContain('EUR');
	});

	it('offers a show-all CTA on empty views and roving tabindex on tabs', async () => {
		const view = await render(Fixture);
		button(view.container, 'Leer').click();
		await Promise.resolve();
		const cta = button(view.container, 'Show all');
		expect(cta.textContent).toContain('3');
		const tabs = [...view.container.querySelectorAll('[role="tab"]')];
		expect(tabs.filter((tab) => tab.getAttribute('tabindex') === '0')).toHaveLength(1);
		cta.click();
		await Promise.resolve();
		expect(view.container.textContent).toContain('A-1');
	});

	it('supports German labels and Austrian formatting through explicit overrides', async () => {
		const view = await render(LocalizedFixture);
		const expectedAmount = new Intl.NumberFormat('de-AT', {
			style: 'currency',
			currency: 'EUR'
		})
			.formatToParts(1234.5)
			.filter((part) => part.type !== 'currency' && part.type !== 'literal')
			.map((part) => part.value)
			.join('');

		expect(view.container.textContent).toContain(expectedAmount);
		expect(view.container.querySelector('input')?.getAttribute('placeholder')).toBe('Suchen…');
	});
});
