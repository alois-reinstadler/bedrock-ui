import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-suggestions.test.svelte';

afterEach(() => cleanup());

describe('ChatSuggestions', () => {
	it('renders one pill button per item with its visible text', async () => {
		const view = await render(Fixture);
		const pills = view.container.querySelectorAll<HTMLButtonElement>(
			'[data-slot="chat-suggestion"]'
		);

		expect(pills).toHaveLength(2);
		expect(pills[0]?.textContent).toContain('Summarize the report');
		expect(pills[1]?.textContent).toContain('Draft an update');
		expect(pills[0]?.classList.contains('tap-target')).toBe(true);
	});

	it('fires onSelect with the clicked suggestion string', async () => {
		const view = await render(Fixture);
		const pills = view.container.querySelectorAll<HTMLButtonElement>(
			'[data-slot="chat-suggestion"]'
		);

		pills[1]?.click();
		await expect
			.poll(() => view.container.querySelector('#selected')?.textContent)
			.toBe('Draft an update');
	});
});
