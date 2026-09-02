import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './chat-composer.test.svelte';

afterEach(() => cleanup());

describe('ChatComposer additions', () => {
	it('shows a stop button while busy that fires onStop', async () => {
		const view = await render(Fixture);
		const busy = view.container.querySelector('#busy-composer');
		const idle = view.container.querySelector('#paste-composer');

		const stop = busy?.querySelector<HTMLButtonElement>('[data-slot="chat-stop-button"]');
		expect(stop?.getAttribute('aria-label')).toBe('Stop');
		expect(busy?.querySelector('[data-slot="chat-send-button"]')).toBeNull();
		expect(idle?.querySelector('[data-slot="chat-send-button"]')).not.toBeNull();
		expect(idle?.querySelector('[data-slot="chat-stop-button"]')).toBeNull();

		stop?.click();
		await expect.poll(() => view.container.querySelector('#stops')?.textContent).toBe('1');
	});

	it('renders the drawer snippet as a full-width row inside the form', async () => {
		const view = await render(Fixture);
		const drawer = view.container.querySelector(
			'#busy-composer [data-slot="chat-composer-drawer"]'
		);

		expect(drawer?.textContent).toContain('draft.pdf');
		expect(drawer?.closest('form')?.dataset.slot).toBe('chat-composer');
	});

	it('calls onFiles when files are pasted into the composer', async () => {
		const view = await render(Fixture);
		const form = view.container.querySelector('#paste-composer form');
		if (!form) throw new Error('Composer form not found');

		const data = new DataTransfer();
		data.items.add(new File(['hello'], 'notes.txt', { type: 'text/plain' }));
		form.dispatchEvent(
			new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
		);

		await expect.poll(() => view.container.querySelector('#pasted')?.textContent).toBe('notes.txt');
	});
});
