import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './link.test.svelte';

afterEach(() => cleanup());

describe('Link', () => {
	it('adds external-link semantics and decoration', async () => {
		const view = await render(Fixture);
		const link = view.container.querySelector('a');
		expect(link?.getAttribute('target')).toBe('_blank');
		expect(link?.getAttribute('rel')?.split(' ')).toEqual(
			expect.arrayContaining(['author', 'noopener', 'noreferrer'])
		);
		expect(link?.querySelector('[data-slot="icon"]')).not.toBeNull();
		expect(link?.textContent).toContain('(opens in new tab)');
	});

	it('removes href and marks disabled links', async () => {
		const view = await render(Fixture);
		const link = [...view.container.querySelectorAll('a')].find((item) =>
			item.textContent?.includes('Disabled')
		);
		expect(link?.hasAttribute('href')).toBe(false);
		expect(link?.getAttribute('aria-disabled')).toBe('true');
	});

	it('supports persistent and hover-only underlines', async () => {
		const view = await render(Fixture);
		const links = view.container.querySelectorAll('a');
		expect(links[0]?.classList.contains('underline')).toBe(true);
		expect(links[2]?.classList.contains('hover:underline')).toBe(true);
	});
});
