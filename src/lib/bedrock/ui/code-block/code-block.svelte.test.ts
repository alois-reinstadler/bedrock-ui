import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './code-block.test.svelte';
import CodeBlock from './code-block.svelte';
import LifecycleFixture from './code-source-lifecycle.test.svelte';
import { fork, flushSync } from 'svelte';
import { highlightCode } from './highlight.js';

afterEach(() => cleanup());

describe('CodeBlock', () => {
	it('keeps current plaintext available while speculative routes are discarded and committed', async () => {
		const route = $state({
			code: 'initial plaintext',
			language: 'plaintext',
			revision: 0,
			visible: true
		});
		const view = await render(LifecycleFixture, { props: { route } });
		const discarded = fork(() => {
			route.code = 'const discarded = 1;';
			route.language = 'typescript';
			route.revision++;
		});
		expect(view.container.querySelector('pre code')?.textContent).toBe('initial plaintext');
		discarded.discard();
		const committed = fork(() => {
			route.code = 'const committed = 2;\n';
			route.language = 'typescript';
			route.revision++;
		});
		await committed.commit();
		expect(view.container.querySelector('pre code')?.textContent).toBe('const committed = 2;\n');
		await vi.waitFor(
			() => expect(view.container.querySelector('[data-slot="code-token"]')).not.toBeNull(),
			{ timeout: 15000 }
		);
		expect(view.container.querySelector('pre code')?.textContent).toBe('const committed = 2;\n');
	});

	it('ignores pending highlighting after a route unmount and remount with different source', async () => {
		const route = $state({
			code: 'const pending = 1;',
			language: 'typescript',
			revision: 0,
			visible: true
		});
		const view = await render(LifecycleFixture, { props: { route } });
		const pending = highlightCode(route.code, route.language);
		flushSync(() => {
			route.visible = false;
		});
		expect(view.container.querySelector('pre')).toBeNull();
		flushSync(() => {
			route.code = '<script>current plaintext</script>\n';
			route.language = 'plaintext';
			route.revision++;
			route.visible = true;
		});
		expect(view.container.querySelector('pre code')?.textContent).toBe(route.code);
		await pending;
		flushSync();
		expect(view.container.querySelector('pre code')?.textContent).toBe(route.code);
		expect(view.container.querySelector('[data-slot="code-token"]')).toBeNull();
		expect(view.container.querySelector('pre script')).toBeNull();
	});

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
		// Shiki loads lazily; under full-suite load the default 1s timeout flakes.
		await vi.waitFor(
			() => expect(view.container.querySelector('[data-slot="code-block"] .shiki')).not.toBeNull(),
			{ timeout: 5000 }
		);
	});

	it('preserves source whitespace before and after highlighting and updates', async () => {
		const code = '/* comment\n   continuation */\n\nconst value = 1;\n';
		const view = await render(CodeBlock, { code, language: 'typescript', wrap: true });
		expect(view.container.querySelector('pre code')?.textContent).toBe(code);
		await vi.waitFor(
			() => expect(view.container.querySelector('[data-slot="code-token"]')).not.toBeNull(),
			{ timeout: 15000 }
		);
		expect(view.container.querySelector('pre code')?.textContent).toBe(code);
		expect(view.container.querySelector('pre')?.classList.contains('whitespace-pre-wrap')).toBe(
			true
		);
		await view.rerender({ code: '<script>alert(1)</script>', language: 'plaintext' });
		expect(view.container.querySelector('pre code')?.textContent).toBe('<script>alert(1)</script>');
		expect(view.container.querySelector('pre script')).toBeNull();
		expect(view.container.querySelector('[data-slot="code-token"]')).toBeNull();
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
