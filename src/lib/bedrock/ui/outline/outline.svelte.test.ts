import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './outline.test.svelte';

afterEach(() => cleanup());

const items = [
	{ id: 'intro', label: 'Introduction', level: 1 },
	{ id: 'setup', label: 'Setup', level: 2 },
	{ id: 'usage', label: 'Usage', level: 3 }
];

function anchors(container: Element): HTMLAnchorElement[] {
	return [...container.querySelectorAll<HTMLAnchorElement>('[data-slot="outline"] a')];
}

describe('Outline', () => {
	it('renders all items inside a labelled nav, indented by level', async () => {
		const view = await render(Fixture, { props: { items } });
		const nav = view.container.querySelector('nav[data-slot="outline"]');
		expect(nav?.getAttribute('aria-label')).toBe('Table of contents');
		const links = anchors(view.container);
		expect(links.map((link) => link.textContent)).toEqual(['Introduction', 'Setup', 'Usage']);
		expect(links.map((link) => link.getAttribute('href'))).toEqual(['#intro', '#setup', '#usage']);
		const indents = links.map((link) => parseFloat(getComputedStyle(link).paddingInlineStart));
		expect(indents[1]).toBeGreaterThan(indents[0]);
		expect(indents[2]).toBeGreaterThan(indents[1]);
	});

	it('exposes a single tab stop via roving tabindex', async () => {
		const view = await render(Fixture, { props: { items } });
		const tabindexes = anchors(view.container).map((link) => link.getAttribute('tabindex'));
		expect(tabindexes.filter((value) => value === '0')).toHaveLength(1);
		expect(tabindexes.filter((value) => value === '-1')).toHaveLength(items.length - 1);
	});

	it('moves focus with ArrowDown/ArrowUp and jumps with Home/End', async () => {
		const view = await render(Fixture, { props: { items } });
		const links = anchors(view.container);
		links[0].focus();
		links[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		expect(document.activeElement).toBe(links[1]);
		// The roving tabindex attribute updates on Svelte's next flush.
		await expect.poll(() => links[1].getAttribute('tabindex')).toBe('0');
		expect(links[0].getAttribute('tabindex')).toBe('-1');
		links[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
		expect(document.activeElement).toBe(links[2]);
		links[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		expect(document.activeElement).toBe(links[0]);
	});

	it('sets activeId and calls onNavigateStart on click', async () => {
		const onNavigateStart = vi.fn();
		const view = await render(Fixture, { props: { items, onNavigateStart } });
		anchors(view.container)[1].click();
		await Promise.resolve();
		expect(onNavigateStart).toHaveBeenCalledExactlyOnceWith('setup');
		expect(view.container.querySelector('[data-testid="active-id"]')?.textContent).toBe('setup');
		const active = anchors(view.container)[1];
		expect(active.getAttribute('aria-current')).toBe('location');
		expect(active.hasAttribute('data-active')).toBe(true);
	});

	it('highlights a controlled activeId without scroll-spy', async () => {
		const view = await render(Fixture, {
			props: { items, activeId: 'usage', scrollSpy: false, withTargets: false }
		});
		const links = anchors(view.container);
		expect(links[2].getAttribute('aria-current')).toBe('location');
		expect(links.filter((link) => link.hasAttribute('data-active'))).toHaveLength(1);
	});
});
