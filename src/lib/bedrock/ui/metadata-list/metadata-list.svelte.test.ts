import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './metadata-list.test.svelte';

afterEach(() => cleanup());

describe('MetadataList', () => {
	it('renders a dl with dt/dd pairs and an en dash for missing values', async () => {
		const view = await render(Fixture);
		const dl = view.container.querySelector('dl')!;
		const terms = dl.querySelectorAll('dt');
		const values = dl.querySelectorAll('dd');

		expect(dl.getAttribute('data-slot')).toBe('metadata-list');
		expect(terms).toHaveLength(5);
		expect(values).toHaveLength(5);
		expect(terms[0].textContent).toContain('Status');
		expect(values[0].textContent).toContain('Active');
		expect(values[4].textContent?.trim()).toBe('–');
	});

	it('lays labels out as a start column or stacked on top', async () => {
		const start = await render(Fixture);
		const startItem = start.container.querySelector('[data-slot="metadata-list-item"]')!;
		expect(startItem.className).toContain('grid-cols-[max-content_1fr]');
		cleanup();

		const top = await render(Fixture, { labelPosition: 'top' });
		const topItem = top.container.querySelector('[data-slot="metadata-list-item"]')!;
		expect(topItem.className).not.toContain('grid-cols-[max-content_1fr]');
	});

	it('collapses items beyond maxItems behind a labelled toggle and reveals them', async () => {
		const view = await render(Fixture, { maxItems: 3 });
		const items = view.container.querySelectorAll<HTMLElement>('[data-slot="metadata-list-item"]');
		const toggle = view.container.querySelector<HTMLButtonElement>('[aria-expanded]')!;

		expect(items[2].hasAttribute('inert')).toBe(false);
		expect(items[3].hasAttribute('inert')).toBe(true);
		expect(items[4].hasAttribute('inert')).toBe(true);
		expect(toggle.textContent).toContain('Show 2 more');
		expect(toggle.getAttribute('aria-expanded')).toBe('false');

		toggle.click();
		await tick();
		expect(items[3].hasAttribute('inert')).toBe(false);
		expect(items[4].hasAttribute('inert')).toBe(false);
		expect(toggle.textContent).toContain('Show less');
		expect(toggle.getAttribute('aria-expanded')).toBe('true');

		toggle.click();
		await tick();
		expect(items[4].hasAttribute('inert')).toBe(true);
		expect(toggle.textContent).toContain('Show 2 more');
	});

	it('renders item icons as decorative', async () => {
		const view = await render(Fixture);
		const icon = view.container.querySelector('dt svg')!;

		expect(icon.getAttribute('aria-hidden')).toBe('true');
		expect(icon.hasAttribute('aria-label')).toBe(false);
	});
});
