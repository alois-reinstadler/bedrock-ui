import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './clickable-card.test.svelte';

afterEach(() => cleanup());

function trigger(container: Element): HTMLElement {
	const match = container.querySelector<HTMLElement>('[data-slot="clickable-card-trigger"]');
	if (!match) throw new Error('Trigger not found');
	return match;
}

describe('ClickableCard', () => {
	it('exposes the required accessible name on the stretched trigger', async () => {
		const view = await render(Fixture, { props: {} });
		expect(trigger(view.container).getAttribute('aria-label')).toBe('Open shift report');
	});

	it('fires onclick once per click on the card surface', async () => {
		let clicks = 0;
		const view = await render(Fixture, { props: { oncard: () => (clicks += 1) } });
		trigger(view.container).click();
		await Promise.resolve();
		expect(clicks).toBe(1);
	});

	it('keeps nested interactive elements independent of the card action', async () => {
		let cardClicks = 0;
		let nestedClicks = 0;
		const view = await render(Fixture, {
			props: { oncard: () => (cardClicks += 1), onnested: () => (nestedClicks += 1) }
		});
		const nested = [...view.container.querySelectorAll('button')].find((item) =>
			item.textContent?.includes('Nested action')
		);
		if (!nested) throw new Error('Nested button not found');
		nested.click();
		await Promise.resolve();
		expect(nestedClicks).toBe(1);
		expect(cardClicks).toBe(0);
	});

	it('renders the trigger as a link when href is set', async () => {
		const view = await render(Fixture, { props: { href: '/reports/1' } });
		const link = trigger(view.container);
		expect(link.tagName).toBe('A');
		expect(link.getAttribute('href')).toBe('/reports/1');
	});

	it('drops the href and blocks clicks when disabled', async () => {
		let clicks = 0;
		const view = await render(Fixture, {
			props: { href: '/reports/1', disabled: true, oncard: () => (clicks += 1) }
		});
		const link = trigger(view.container);
		expect(link.getAttribute('href')).toBeNull();
		expect(link.getAttribute('aria-disabled')).toBe('true');
		link.click();
		await Promise.resolve();
		expect(clicks).toBe(0);
	});
});
