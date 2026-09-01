import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './text.test.svelte';

afterEach(() => cleanup());

function element(container: Element, testId: string): HTMLElement {
	const match = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!match) throw new Error(`Element not found: ${testId}`);
	return match;
}

describe('Text', () => {
	it('renders the selected HTML element and forwards label attributes', async () => {
		const view = await render(Fixture);
		expect(element(view.container, 'default').tagName).toBe('SPAN');
		expect(element(view.container, 'paragraph').tagName).toBe('P');
		expect(element(view.container, 'division').tagName).toBe('DIV');
		expect(element(view.container, 'label-element').tagName).toBe('LABEL');
		expect(element(view.container, 'label-element').getAttribute('for')).toBe('field');
	});

	it.each([
		['body', ['text-sm']],
		['large', ['text-base']],
		['label', ['text-sm', 'font-medium']],
		['supporting', ['text-xs', 'text-muted-foreground']],
		['code', ['font-code', 'text-sm']],
		['display-1', ['text-6xl', 'font-semibold', 'tracking-tight']],
		['display-2', ['text-5xl', 'font-semibold', 'tracking-tight']],
		['display-3', ['text-4xl', 'font-semibold', 'tracking-tight']]
	])('maps %s to its semantic classes', async (type, classes) => {
		const view = await render(Fixture);
		expect([...element(view.container, type).classList]).toEqual(expect.arrayContaining(classes));
	});

	it.each([
		['default', 'text-foreground'],
		['muted', 'text-muted-foreground'],
		['accent', 'text-primary'],
		['destructive', 'text-destructive']
	])('maps %s color to %s', async (testId, className) => {
		const view = await render(Fixture);
		expect(element(view.container, testId).classList).toContain(className);
	});

	it('allows inherited color and lets an explicit color override supporting text', async () => {
		const view = await render(Fixture);
		expect(element(view.container, 'inherit').className).not.toMatch(
			/text-(foreground|muted|primary|destructive)/
		);
		const supportingAccent = element(view.container, 'supporting-accent');
		expect(supportingAccent.classList).toContain('text-primary');
		expect(supportingAccent.classList).not.toContain('text-muted-foreground');
	});

	it('gives maxLines precedence over single-line truncation', async () => {
		const view = await render(Fixture);
		expect(element(view.container, 'truncate').classList).toContain('truncate');
		const clamp = element(view.container, 'clamp');
		expect(clamp.classList).not.toContain('truncate');
		expect(clamp.style.webkitLineClamp).toBe('3');
		expect(clamp.style.overflow).toBe('hidden');
	});
});
