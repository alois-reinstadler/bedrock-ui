import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Diff from './diff.svelte';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});
const props = { before: 'a\nb\nz\n', after: 'a\nx\ny\nz\n', title: 'example.ts' };

describe('Diff', () => {
	it('switches layouts while keeping replacements aligned', async () => {
		const view = await render(Diff, props);
		expect(view.container.querySelector('[data-slot="diff"]')?.getAttribute('data-view')).toBe(
			'unified'
		);
		await view.getByRole('button', { name: 'Side by side' }).click();
		expect(view.container.querySelector('[data-slot="diff"]')?.getAttribute('data-view')).toBe(
			'split'
		);
		const rows = view.container.querySelectorAll('tbody tr');
		expect(rows).toHaveLength(4);
		expect(rows[2].querySelector('[data-kind="empty"]')).not.toBeNull();
		expect(rows[3].textContent).toContain('z');
		await view.getByRole('button', { name: 'Unified', exact: true }).click();
		expect(view.container.querySelectorAll('tbody tr')).toHaveLength(5);
	});

	it('reuses CodeBlock tokens with independent multiline context in each version', async () => {
		const source = 'const value = 1;\n';
		const view = await render(Diff, {
			before: '/*\n' + source + '*/\n',
			after: source,
			language: 'typescript',
			view: 'split'
		});
		await vi.waitFor(
			() => {
				const row = view.container.querySelector('td[data-kind="unchanged"]')?.closest('tr');
				const cells = row?.querySelectorAll('.diff-code');
				expect(cells?.[0].querySelectorAll('[data-slot="code-token"]')).toHaveLength(1);
				expect(cells?.[1].querySelectorAll('[data-slot="code-token"]').length).toBeGreaterThan(1);
			},
			{ timeout: 15000 }
		);
		await view.getByRole('button', { name: 'Unified', exact: true }).click();
		expect(
			view.container.querySelector('tr[data-kind="unchanged"] [data-slot="code-token"]')
				?.textContent
		).toBe('const');
		await view.rerender({ before: '', after: '<img src=x>', language: 'unknown-grammar' });
		await vi.waitFor(() =>
			expect(view.container.querySelectorAll('[data-slot="code-token"]')).toHaveLength(0)
		);
		expect(view.container.querySelector('img')).toBeNull();
		expect(view.container.textContent).toContain('<img src=x>');
	});

	it('recomputes changes when the source props change', async () => {
		const view = await render(Diff, { ...props, view: 'split', lineNumbers: false });
		await view.rerender({ after: props.before });
		expect(view.container.textContent).toContain('No changes');
		expect(view.container.querySelectorAll('[data-kind="added"]')).toHaveLength(0);
		expect(view.container.querySelectorAll('.diff-number')).toHaveLength(0);
		expect(view.container.querySelectorAll('tbody tr')).toHaveLength(3);
	});

	it('expands hunk context, keeps it across views, and resets it for new sources', async () => {
		const before = Array.from({ length: 30 }, (_, i) => `line ${i + 1}`).join('\n');
		const after = before.replace('line 5\n', 'updated 5\n').replace('line 25\n', 'updated 25\n');
		const view = await render(Diff, { before, after, contextLines: 1 });
		expect(view.container.querySelectorAll('[data-slot="diff-hunk"]')).toHaveLength(2);
		expect(view.container.querySelectorAll('[data-code-highlight]')).toHaveLength(4);
		expect(view.container.textContent).not.toContain('line 15');
		await view.getByRole('button', { name: 'Show 17 unchanged lines' }).click();
		expect(view.container.textContent).toContain('line 15');
		await view.getByRole('button', { name: 'Side by side' }).click();
		expect(view.container.textContent).toContain('line 15');
		await view.rerender({ after: after.replace('updated 5', 'changed 5') });
		expect(view.container.textContent).not.toContain('line 15');
		await view.rerender({ contextLines: null, wordHighlight: false });
		expect(view.container.textContent).toContain('line 15');
		expect(view.container.querySelector('[data-slot="diff-gap"]')).toBeNull();
		expect(view.container.querySelector('[data-code-highlight]')).toBeNull();
	});

	it('copies the exact updated text and announces failures', async () => {
		const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
		const view = await render(Diff, { before: '', after: 'x\r\n' });
		await view.getByRole('button', { name: 'Copy updated text' }).click();
		expect(writeText).toHaveBeenCalledWith('x\r\n');
		await expect.element(view.getByRole('status')).toHaveTextContent('Copied');
		writeText.mockRejectedValue(new Error('Denied'));
		await view.getByRole('button', { name: 'Copied', exact: true }).click();
		await expect.element(view.getByRole('status')).toHaveTextContent('Copy failed');
	});

	it('escapes source and supports empty state, localized labels, and scrolling', async () => {
		const view = await render(Diff, {
			before: '<img src=x>\n',
			after: '<img src=x>\n',
			wrap: true,
			maxHeight: 120,
			copyButton: false,
			viewToggle: false,
			labels: { noChanges: 'Identical' }
		});
		expect(view.container.querySelector('img')).toBeNull();
		expect(view.container.textContent).toContain('<img src=x>');
		expect(view.container.textContent).toContain('Identical');
		expect(view.container.querySelector('button')).toBeNull();
		expect(
			view.container.querySelector('[data-slot="diff-content"]')?.getAttribute('style')
		).toContain('120px');
	});
});
