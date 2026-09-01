import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './blockquote.test.svelte';

afterEach(() => cleanup());

describe('Blockquote', () => {
	it('only wraps attributed quotes in a figure', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelectorAll('blockquote')).toHaveLength(2);
		expect(view.container.querySelectorAll('figure')).toHaveLength(1);
		expect(view.container.querySelector('figcaption cite')?.textContent).toBe('Ada Lovelace');
	});

	it('forwards citeUrl to the blockquote cite attribute', async () => {
		const view = await render(Fixture);
		expect(view.container.querySelector('figure blockquote')?.getAttribute('cite')).toBe(
			'https://example.com/source'
		);
	});
});
