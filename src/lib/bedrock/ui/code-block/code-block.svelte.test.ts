import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './code-block.test.svelte';

afterEach(() => cleanup());

describe('CodeBlock', () => {
	it('renders fallback, header, line numbers, wrapping, and max height', async () => {
		const view = await render(Fixture);
		const blocks = view.container.querySelectorAll('[data-slot="code-block"]');
		const content = blocks[0]?.querySelector('[data-slot="code-block-content"]');
		expect(view.container.textContent).toContain('const answer = 42;');
		expect(view.container.textContent).toContain('answer.js');
		expect(view.container.textContent).toContain('javascript');
		expect(content?.classList.contains('line-numbers')).toBe(true);
		expect(content?.getAttribute('style')).toContain('max-height: 120px');
		expect(content?.querySelector('pre')?.classList.contains('whitespace-pre-wrap')).toBe(true);
		expect(content?.querySelectorAll('.line')).toHaveLength(2);
		expect(blocks[1]?.querySelector('.shiki')).toBeNull();
		expect(blocks[1]?.textContent).toContain('plain text');
	});

	it('highlights a supported language after loading Shiki', async () => {
		const view = await render(Fixture);
		await vi.waitFor(() =>
			expect(view.container.querySelector('[data-slot="code-block"] .shiki')).not.toBeNull()
		);
	});

	it('copies code and exposes the copied state', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
		const view = await render(Fixture);
		view.container.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')?.click();
		await vi.waitFor(() =>
			expect(writeText).toHaveBeenCalledWith('const answer = 42;\nconsole.log(answer);')
		);
		await vi.waitFor(() =>
			expect(view.container.querySelector('button[aria-label="Copied"]')).not.toBeNull()
		);
	});
});
