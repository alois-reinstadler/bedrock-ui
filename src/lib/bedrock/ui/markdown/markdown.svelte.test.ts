import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './markdown.test.svelte';

afterEach(() => cleanup());

describe('Markdown', () => {
	it('renders headings with generated ids and clamps the level start', async () => {
		const view = await render(Fixture, {
			props: { content: '# Alpha One\n\n###### Deep Dive', headingLevelStart: 3 as const }
		});
		const h3 = view.container.querySelector('h3');
		expect(h3?.id).toBe('alpha-one');
		// depth 6 with start 3 would be level 8; it must clamp at h6.
		expect(view.container.querySelector('h6')?.id).toBe('deep-dive');
	});

	it('renders blocks through Bedrock components', async () => {
		const content = [
			'A paragraph.',
			'',
			'- one',
			'- two',
			'',
			'| A | B |',
			'| --- | ---: |',
			'| 1 | 2 |',
			'',
			'```ts',
			'const x = 1;',
			'```'
		].join('\n');
		const view = await render(Fixture, { props: { content } });
		expect(view.container.querySelector('p[data-slot="text"]')?.textContent).toBe('A paragraph.');
		expect(view.container.querySelector('[data-slot="list"]')?.textContent).toContain('one');
		expect(view.container.querySelector('[data-slot="table"]')).not.toBeNull();
		expect(view.container.querySelector('[data-slot="code-block"]')?.textContent).toContain(
			'const x = 1;'
		);
	});

	it('renders raw HTML as escaped text and never injects it', async () => {
		const view = await render(Fixture, {
			props: { content: 'Before\n\n<script>window.alert(1)<' + '/script>\n\nAfter' }
		});
		expect(view.container.querySelector('script')).toBeNull();
		expect(view.container.textContent).toContain('<script>window.alert(1)</script>');
	});

	it('renders citations for matching sources only', async () => {
		const view = await render(Fixture, {
			props: {
				content: 'See [a1] and [nope].',
				sources: { a1: { title: 'Alpha Doc' } }
			}
		});
		const citations = view.container.querySelectorAll('[data-slot="citation"]');
		expect(citations).toHaveLength(1);
		expect(citations[0].textContent).toContain('Alpha Doc');
		expect(view.container.textContent).toContain('[nope]');
		expect(view.container.textContent).not.toContain('[a1]');
	});

	it('prevents navigation when onLinkClick returns false', async () => {
		const onLinkClick = vi.fn<(href: string, event: MouseEvent) => false>(() => false);
		const view = await render(Fixture, {
			props: { content: '[go](#target)', onLinkClick }
		});
		const anchor = view.container.querySelector('a[data-slot="link"]');
		expect(anchor).not.toBeNull();
		const event = new MouseEvent('click', { bubbles: true, cancelable: true });
		anchor?.dispatchEvent(event);
		expect(onLinkClick).toHaveBeenCalledOnce();
		expect(onLinkClick.mock.calls[0][0]).toBe('#target');
		expect(event.defaultPrevented).toBe(true);
	});
});
