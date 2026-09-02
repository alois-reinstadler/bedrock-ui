import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-message-actions.test.svelte';

afterEach(() => cleanup());

function actionButton(container: Element, label: string): HTMLButtonElement {
	const match = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
	if (!match) throw new Error(`Action not found: ${label}`);
	return match;
}

describe('ChatMessageActions', () => {
	it('renders nothing when no handlers are provided', async () => {
		const view = await render(Fixture);
		const bare = view.container.querySelector('#without-handlers');

		expect(bare?.querySelector('[data-slot="chat-message-actions"]')).toBeNull();
		expect(
			view.container.querySelector('#with-handlers [data-slot="chat-message-actions"]')
		).not.toBeNull();
	});

	it('copy calls the handler and flips to copied feedback', async () => {
		const view = await render(Fixture);
		const actions = view.container.querySelector('#with-handlers');
		if (!actions) throw new Error('Missing fixture section');

		const copy = actionButton(actions, 'Copy');
		const iconBefore = copy.innerHTML;
		copy.click();

		await expect.poll(() => actions.querySelector('button[aria-label="Copied"]')).not.toBeNull();
		expect(view.container.querySelector('#copies')?.textContent).toBe('1');
		expect(actions.querySelector('button[aria-label="Copied"]')?.innerHTML).not.toBe(iconBefore);
	});

	it('fires retry and feedback handlers', async () => {
		const view = await render(Fixture);
		const actions = view.container.querySelector('#with-handlers');
		if (!actions) throw new Error('Missing fixture section');

		actionButton(actions, 'Retry').click();
		await expect.poll(() => view.container.querySelector('#retries')?.textContent).toBe('1');

		actionButton(actions, 'Good response').click();
		await expect.poll(() => view.container.querySelector('#feedback')?.textContent).toBe('up');

		actionButton(actions, 'Bad response').click();
		await expect.poll(() => view.container.querySelector('#feedback')?.textContent).toBe('down');
	});
});
