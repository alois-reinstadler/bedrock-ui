import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './citation.test.svelte';

afterEach(() => cleanup());

describe('Citation', () => {
	it('uses a link only when the source has a URL', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('a')?.getAttribute('href')).toBe('https://example.com');
		expect(view.container.querySelectorAll('span[data-slot="citation"]')).toHaveLength(2);
	});

	it('names sources with their number and title', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('[data-slot="citation"]')?.getAttribute('aria-label')).toBe(
			'Source 1: Linked source'
		);
	});

	it('renders label and number variants', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('a')?.textContent).toContain('Linked source');
		expect(
			view.container.querySelector('[aria-label="Source 3: Numeric source"]')?.textContent
		).toContain('3');
	});
});
