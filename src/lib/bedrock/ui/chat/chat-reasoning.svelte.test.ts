import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-reasoning.test.svelte';

afterEach(() => cleanup());

describe('ChatReasoning', () => {
	it('toggles the reasoning content open via the trigger', async () => {
		const view = await render(Fixture);
		const idle = view.container.querySelector('#idle');
		const trigger = idle?.querySelector<HTMLButtonElement>('[data-slot="chat-reasoning-trigger"]');
		// bits-ui keeps closed content mounted but hidden.
		const content = idle?.querySelector('[data-slot="collapsible-content"]');

		expect(trigger?.textContent).toContain('Reasoning');
		expect(trigger?.getAttribute('aria-expanded')).toBe('false');
		expect(content?.hasAttribute('hidden')).toBe(true);

		trigger?.click();
		await expect.poll(() => content?.hasAttribute('hidden')).toBe(false);
		expect(content?.textContent).toContain('Chain of thought');
		expect(trigger?.getAttribute('aria-expanded')).toBe('true');

		trigger?.click();
		await expect.poll(() => content?.hasAttribute('hidden')).toBe(true);
	});

	it('marks the surface aria-busy while working and shows a spinner', async () => {
		const view = await render(Fixture);
		const idle = view.container.querySelector('#idle');
		const busy = view.container.querySelector('#busy');

		expect(idle?.getAttribute('aria-busy')).toBeNull();
		expect(busy?.getAttribute('aria-busy')).toBe('true');
		expect(busy?.querySelector('.animate-spin')).not.toBeNull();
		expect(idle?.querySelector('.animate-spin')).toBeNull();
	});
});
