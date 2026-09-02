import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-tool-calls.test.svelte';

afterEach(() => cleanup());

function section(container: Element, id: string): Element {
	const match = container.querySelector(`#${id}`);
	if (!match) throw new Error(`Section not found: ${id}`);
	return match;
}

describe('ChatToolCalls', () => {
	it('renders a single call as one inline row without a group trigger', async () => {
		const view = await render(Fixture);
		const single = section(view.container, 'single');

		expect(single.querySelector('[data-slot="chat-tool-calls-trigger"]')).toBeNull();
		const rows = single.querySelectorAll('[data-slot="chat-tool-call"]');
		expect(rows).toHaveLength(1);
		expect(rows[0]?.textContent).toContain('read_file');
		expect(rows[0]?.textContent).toContain('src/app.ts');
		expect(rows[0]?.textContent).toContain('0.2s');
	});

	it('groups multiple calls behind a collapsible header showing count and latest name', async () => {
		const view = await render(Fixture);
		const group = section(view.container, 'group');

		const trigger = group.querySelector<HTMLButtonElement>('[data-slot="chat-tool-calls-trigger"]');
		expect(trigger?.textContent).toContain('3 tool calls');
		expect(trigger?.textContent).toContain('run_check');
		// bits-ui keeps closed content mounted but hidden.
		const content = group.querySelector('[data-slot="collapsible-content"]');
		expect(content?.hasAttribute('hidden')).toBe(true);

		trigger?.click();
		await expect.poll(() => content?.hasAttribute('hidden')).toBe(false);
		expect(group.querySelectorAll('[data-slot="chat-tool-call"]')).toHaveLength(3);
		expect(content?.textContent).toContain('grep');
		expect(content?.textContent).toContain('read_file');
	});

	it('reveals the detail CodeBlock when a row with detail is clicked', async () => {
		const view = await render(Fixture);
		const single = section(view.container, 'single');

		const row = single.querySelector<HTMLButtonElement>('[data-slot="chat-tool-call"] button');
		expect(row?.getAttribute('aria-expanded')).toBe('false');
		expect(single.querySelector('[data-slot="code-block"]')).toBeNull();

		row?.click();
		await expect.poll(() => row?.getAttribute('aria-expanded')).toBe('true');
		await expect
			.poll(() => single.querySelector('[data-slot="code-block"]')?.textContent ?? '')
			.toContain('payload {}');
	});

	it('marks statuses with the matching glyphs', async () => {
		const view = await render(Fixture);
		const group = section(view.container, 'group');
		group.querySelector<HTMLButtonElement>('[data-slot="chat-tool-calls-trigger"]')?.click();
		await expect.poll(() => group.querySelectorAll('[data-slot="chat-tool-call"]').length).toBe(3);

		const running = group.querySelector('[data-slot="chat-tool-call"][data-status="running"]');
		const complete = group.querySelector('[data-slot="chat-tool-call"][data-status="complete"]');
		expect(running?.querySelector('.animate-spin')).not.toBeNull();
		expect(complete?.querySelector('.animate-spin')).toBeNull();
		expect(complete?.querySelector('[data-slot="icon"]')).not.toBeNull();
	});

	it('renders error text on failed calls', async () => {
		const view = await render(Fixture);
		const group = section(view.container, 'group');
		group.querySelector<HTMLButtonElement>('[data-slot="chat-tool-calls-trigger"]')?.click();

		await expect
			.poll(
				() =>
					group.querySelector('[data-slot="chat-tool-call"][data-status="error"]')?.textContent ??
					''
			)
			.toContain('Exited with code 1.');
		const errorRow = group.querySelector('[data-slot="chat-tool-call"][data-status="error"]');
		expect(errorRow?.querySelector('.text-destructive')).not.toBeNull();
	});
});
