import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import AvatarStack from './avatar-stack.svelte';

afterEach(cleanup);
const settle = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const alex = { fallback: 'AL', name: 'Alex' };
const blake = { fallback: 'BK', name: 'Blake' };
const cam = { fallback: 'CM', name: 'Cam' };

function trigger(container: Element, name: string) {
	const element = container.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`);
	if (!element) throw new Error(`Missing avatar ${name}`);
	return element;
}

describe('AvatarStack', () => {
	it('commits default membership layout immediately without transform projection', async () => {
		const view = await render(AvatarStack, { props: { items: [alex, blake, cam] } });
		await view.rerender({ items: [cam, alex, blake] });
		await settle(30);
		for (const button of view.container.querySelectorAll('button')) {
			expect(getComputedStyle(button).transform).toBe('none');
			expect(button.getAnimations()).toHaveLength(0);
		}
	});

	it('preserves native focus with opt-in membership continuity', async () => {
		const view = await render(AvatarStack, {
			props: { items: [alex, blake, cam], animateLayout: true }
		});
		const button = trigger(view.container, 'Alex');
		button.focus();
		await view.rerender({ items: [cam, blake, alex], animateLayout: true });
		await settle(30);
		expect(trigger(view.container, 'Alex')).toBe(button);
		expect(document.activeElement).toBe(button);
	});

	it('preserves native trigger identity and the active preview through reorder', async () => {
		const view = await render(AvatarStack, { props: { items: [alex, blake, cam] } });
		const button = trigger(view.container, 'Alex');
		button.focus();
		await settle(30);
		await view.rerender({ items: [cam, blake, alex] });
		await settle(60);
		expect(trigger(view.container, 'Alex')).toBe(button);
		expect(document.activeElement).toBe(button);
		expect(view.container.querySelector('[data-slot="avatar-stack-card"]')?.textContent).toContain(
			'Alex'
		);
	});

	it('accepts duplicate display identities and cleans up a removed active preview', async () => {
		const view = await render(AvatarStack, { props: { items: [alex, { ...alex }, blake] } });
		expect(view.container.querySelectorAll('button[aria-label="Alex"]')).toHaveLength(2);
		trigger(view.container, 'Blake').focus();
		await settle(30);
		await view.rerender({ items: [alex] });
		await settle(60);
		expect(view.container.querySelectorAll('button')).toHaveLength(1);
		expect(view.container.querySelector('[data-slot="avatar-stack-card"]')).toBeNull();
	});

	it('keeps the overflow preview correct after rapid membership updates', async () => {
		const view = await render(AvatarStack, { props: { items: [alex, blake, cam], max: 1 } });
		trigger(view.container, 'Show 2 more').focus();
		await settle(30);
		await view.rerender({ items: [alex, cam], max: 1 });
		await view.rerender({ items: [alex, blake, cam], max: 1 });
		await settle(60);
		expect(trigger(view.container, 'Show 2 more')).toBe(document.activeElement);
		expect(view.container.querySelectorAll('[data-slot="avatar-stack-member"]')).toHaveLength(2);
	});
});
