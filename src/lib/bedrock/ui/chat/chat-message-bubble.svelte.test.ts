import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-message-bubble.test.svelte';

afterEach(() => cleanup());

function bubble(container: Element, selector: string): HTMLElement {
	const match = container.querySelector<HTMLElement>(selector);
	if (!match) throw new Error(`Bubble not found: ${selector}`);
	return match;
}

describe('ChatMessageBubble', () => {
	it('reduces sender-side corners per group position on the assistant side', async () => {
		const view = await render(Fixture);
		const scope = '[data-role="assistant"] [data-slot="chat-message-bubble"]';

		const first = bubble(view.container, `${scope}[data-group="first"]`);
		expect(first.classList.contains('group-data-[role=assistant]/chat-message:rounded-bl-md')).toBe(
			true
		);
		expect(first.classList.contains('group-data-[role=assistant]/chat-message:rounded-bl-sm')).toBe(
			false
		);

		const middle = bubble(view.container, `${scope}[data-group="middle"]`);
		expect(middle.classList.contains('group-data-[role=assistant]/chat-message:rounded-l-md')).toBe(
			true
		);

		// The last bubble keeps the small sender-side tail.
		const last = bubble(view.container, `${scope}[data-group="last"]`);
		expect(last.classList.contains('group-data-[role=assistant]/chat-message:rounded-tl-md')).toBe(
			true
		);
		expect(last.classList.contains('group-data-[role=assistant]/chat-message:rounded-bl-sm')).toBe(
			true
		);
	});

	it('mirrors the group classes on the user side', async () => {
		const view = await render(Fixture);
		const first = bubble(
			view.container,
			'[data-role="user"] [data-slot="chat-message-bubble"][data-group="first"]'
		);

		expect(first.classList.contains('group-data-[role=user]/chat-message:rounded-br-md')).toBe(
			true
		);
		expect(first.classList.contains('group-data-[role=user]/chat-message:rounded-br-sm')).toBe(
			false
		);
	});

	it('keeps padding but drops the background for the ghost variant', async () => {
		const view = await render(Fixture);
		const ghost = bubble(view.container, '[data-slot="chat-message-bubble"][data-variant="ghost"]');
		const filled = bubble(
			view.container,
			'[data-slot="chat-message-bubble"][data-variant="filled"]'
		);

		expect(ghost.classList.contains('bg-transparent')).toBe(true);
		expect(ghost.classList.contains('px-3.5')).toBe(true);
		expect(filled.classList.contains('bg-transparent')).toBe(false);
		expect(filled.classList.contains('group-data-[role=assistant]/chat-message:bg-muted')).toBe(
			true
		);
	});
});
