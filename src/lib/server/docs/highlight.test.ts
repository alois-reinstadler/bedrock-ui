import { describe, expect, it } from 'vitest';
import { highlight } from './highlight.js';

describe('documentation highlighting', () => {
	it('provides light and dark token colors before hydration', async () => {
		const html = await highlight("import * as Avatar from '#lib/bedrock/ui/avatar';", 'typescript');
		expect(html).toContain('--shiki-light:');
		expect(html).toContain('--shiki-dark:');
		expect(html).toContain('Avatar');
		expect(await highlight("import * as Avatar from '#lib/bedrock/ui/avatar';", 'typescript')).toBe(
			html
		);
	});
	it('escapes source markup before rendering it as HTML', async () => {
		const html = await highlight('<script>alert("example")</script>', 'svelte');
		expect(html).not.toContain('<script>');
		expect(html).toMatch(/&(?:lt|#x3[Cc]|#60);/);
	});
});
