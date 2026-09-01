import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './heading.test.svelte';

afterEach(() => cleanup());

function element(container: Element, testId: string): HTMLElement {
	const match = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
	if (!match) throw new Error(`Element not found: ${testId}`);
	return match;
}

describe('Heading', () => {
	it.each([1, 2, 3, 4, 5, 6])('renders level %s as the matching heading element', async (level) => {
		const view = await render(Fixture);
		expect(element(view.container, `level-${level}`).tagName).toBe(`H${level}`);
	});

	it.each([
		['level-1', 'text-3xl'],
		['level-2', 'text-2xl'],
		['level-3', 'text-xl'],
		['level-4', 'text-lg'],
		['level-5', 'text-base'],
		['level-6', 'text-sm'],
		['display-1', 'text-6xl'],
		['display-2', 'text-5xl'],
		['display-3', 'text-4xl']
	])('maps %s to %s while retaining heading typography', async (testId, sizeClass) => {
		const view = await render(Fixture);
		const heading = element(view.container, testId);
		expect([...heading.classList]).toEqual(
			expect.arrayContaining([sizeClass, 'font-heading', 'font-semibold', 'tracking-tight'])
		);
	});

	it('sets aria-level only when it differs from the rendered level', async () => {
		const view = await render(Fixture);
		expect(element(view.container, 'same-aria').hasAttribute('aria-level')).toBe(false);
		expect(element(view.container, 'different-aria').getAttribute('aria-level')).toBe('2');
	});

	it.each([
		['level-2', 'text-foreground'],
		['muted', 'text-muted-foreground'],
		['accent', 'text-primary'],
		['destructive', 'text-destructive']
	])('maps %s color to %s', async (testId, className) => {
		const view = await render(Fixture);
		expect(element(view.container, testId).classList).toContain(className);
	});

	it('allows inherited color and gives maxLines precedence over truncation', async () => {
		const view = await render(Fixture);
		expect(element(view.container, 'inherit').className).not.toMatch(
			/text-(foreground|muted|primary|destructive)/
		);
		expect(element(view.container, 'truncate').classList).toContain('truncate');
		const clamp = element(view.container, 'clamp');
		expect(clamp.classList).not.toContain('truncate');
		expect(clamp.style.webkitLineClamp).toBe('2');
	});
});
