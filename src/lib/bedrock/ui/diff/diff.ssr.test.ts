import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import { Diff } from './index';

describe('Diff SSR', () => {
	it('renders escaped changes without browser APIs', async () => {
		const { body } = await render(Diff, {
			props: { before: '<script>old</script>\n', after: '<script>new</script>\n' }
		});
		expect(body).toContain('data-kind="removed"');
		expect(body).toContain('data-kind="added"');
		// Highlight spans can split the escaped source into several text nodes.
		expect(body.replace(/<[^>]*>/g, '')).toContain('&lt;script>new&lt;/script>');
		expect(body).not.toContain('<script>new');
	});
});
