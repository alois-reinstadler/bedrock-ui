import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './family-defaults.test.svelte';

afterEach(cleanup);

describe('family motion defaults', () => {
	it('keeps history, urgent feedback and initially checked controls readable at mount', async () => {
		const view = await render(Fixture);
		for (const node of view.container.querySelectorAll(
			'[data-slot="banner"], [data-slot="chat-message"]'
		)) {
			expect(node.getAttribute('data-entry')).toBe('false');
			expect(getComputedStyle(node).opacity).toBe('1');
			expect(node.getAnimations()).toHaveLength(0);
		}
		const checked = view.container.querySelector(
			'[aria-label="Initially checked"] [data-slot="checkbox-check"]'
		)!;
		expect(checked.hasAttribute('data-animate')).toBe(false);
		expect(checked.querySelector('path')!.getAnimations()).toHaveLength(0);
	});

	it('allows deliberate insertion and checkbox feedback without replaying history', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'Add message' }).click();
		expect(
			view.container.querySelectorAll('[data-slot="chat-message"][data-entry="true"]')
		).toHaveLength(1);
		const checkbox = view.container.querySelector<HTMLButtonElement>(
			'[aria-label="Interactive checkbox"]'
		)!;
		flushSync(() => checkbox.click());
		expect(checkbox.getAttribute('aria-checked')).toBe('true');
		expect(
			checkbox.querySelector('[data-slot="checkbox-check"]')!.hasAttribute('data-animate')
		).toBe(true);
	});

	it('does not animate deliberate insertions under application reduction', async () => {
		const view = await render(Fixture, { reduced: true });
		await view.getByRole('button', { name: 'Add message' }).click();
		const message = view.container.querySelector('[data-entry="true"]')!;
		expect(message.getAttribute('data-bedrock-motion')).toBe('reduced');
		expect(getComputedStyle(message).opacity).toBe('1');
		expect(
			message.getAnimations().filter((animation) => animation.playState === 'running')
		).toHaveLength(0);
	});
});
