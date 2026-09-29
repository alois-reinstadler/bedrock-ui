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

import Composer from './chat-composer.svelte';

it('retains text and files after a rejected send, prevents duplicate sends, and clears on retry', async () => {
	let rejectSend: (reason: unknown) => void = () => {};
	let calls = 0;
	const attached = new File(['hello'], 'notes.txt', { type: 'text/plain' });
	const view = await render(Composer, {
		value: '  Saved draft  ',
		attachments: true,
		files: [attached],
		onSend: (message, submission) => {
			calls++;
			expect(message).toBe('Saved draft');
			expect(submission.files).toEqual([attached]);
			if (calls === 1)
				return new Promise<void>((_resolve, reject) => {
					rejectSend = reject;
				});
		}
	});
	const button = view.container.querySelector<HTMLButtonElement>('[data-slot="chat-send-button"]')!;
	const textarea = view.container.querySelector('textarea')!;
	button.click();
	await expect.poll(() => button.disabled).toBe(true);
	expect(textarea.disabled).toBe(true);
	button.click();
	expect(calls).toBe(1);
	rejectSend(new Error('Upload failed'));
	await expect
		.poll(() => view.container.querySelector('[role="alert"]')?.textContent)
		.toContain('Your draft is saved');
	expect(textarea.value).toBe('  Saved draft  ');
	expect(view.container.querySelectorAll('[data-slot="chat-composer-file"]')).toHaveLength(1);
	button.click();
	await expect.poll(() => textarea.value).toBe('');
	expect(view.container.querySelectorAll('[data-slot="chat-composer-file"]')).toHaveLength(0);
	expect(calls).toBe(2);
	await expect.poll(() => document.activeElement).toBe(textarea);
});

it('ignores pasted files while disabled and single-file mode replaces the queue', async () => {
	const paste = (form: HTMLFormElement, names: string[]) => {
		const data = new DataTransfer();
		names.forEach((name) => data.items.add(new File(['data'], name, { type: 'text/plain' })));
		form.dispatchEvent(
			new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
		);
	};
	let calls = 0;
	const disabled = await render(Composer, {
		disabled: true,
		attachments: true,
		onFiles: () => {
			calls++;
		}
	});
	paste(disabled.container.querySelector('form')!, ['ignored.txt']);
	await expect
		.poll(() => disabled.container.querySelectorAll('[data-slot="chat-composer-file"]').length)
		.toBe(0);
	expect(calls).toBe(0);
	const single = await render(Composer, { attachments: true, multiple: false });
	const form = single.container.querySelector('form')!;
	paste(form, ['first.txt']);
	await expect.poll(() => form.textContent).toContain('first.txt');
	paste(form, ['next.txt', 'extra.txt']);
	await expect.poll(() => form.textContent).toContain('next.txt');
	expect(form.textContent).not.toContain('first.txt');
	expect(form.querySelectorAll('[data-slot="chat-composer-file"]')).toHaveLength(1);
});
