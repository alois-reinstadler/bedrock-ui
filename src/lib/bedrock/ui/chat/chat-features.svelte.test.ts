import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import MessageStatus from './chat-message-status.svelte';
import MessageEditor from './chat-message-editor.svelte';
import MessageActions from './chat-message-actions.svelte';
import Composer from './chat-composer.svelte';
import Root from './chat.svelte';
afterEach(() => cleanup());

it('blocks duplicate retry requests, catches rejection, and allows another attempt', async () => {
	let reject: (reason?: unknown) => void = () => {};
	let calls = 0;
	const view = await render(MessageStatus, {
		status: 'failed',
		onRetry: () => {
			calls++;
			if (calls === 1)
				return new Promise<void>((_resolve, no) => {
					reject = no;
				});
		}
	});
	const button = view.container.querySelector('button')!;
	button.click();
	button.click();
	await expect.poll(() => button.disabled).toBe(true);
	expect(calls).toBe(1);
	reject(new Error('offline'));
	await expect
		.poll(() => view.container.querySelector('[role="alert"]')?.textContent)
		.toContain('Retry failed');
	button.click();
	await expect.poll(() => calls).toBe(2);
	await expect.poll(() => button.disabled).toBe(false);
});

it('locks an editor while saving and retains its value after rejection', async () => {
	let reject: (reason?: unknown) => void = () => {};
	let cancels = 0;
	const view = await render(MessageEditor, {
		value: 'Saved edit',
		onSave: () =>
			new Promise<void>((_resolve, no) => {
				reject = no;
			}),
		onCancel: () => {
			cancels++;
		}
	});
	const form = view.container.querySelector('form')!;
	const input = view.container.querySelector('textarea')!;
	form.requestSubmit();
	await expect.poll(() => input.disabled).toBe(true);
	input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	expect(cancels).toBe(0);
	reject(new Error('failed'));
	await expect.poll(() => input.disabled).toBe(false);
	expect(input.value).toBe('Saved edit');
	await expect.poll(() => document.activeElement).toBe(input);
	expect(view.container.querySelector('[role="alert"]')?.textContent).toContain('Could not resend');
});

it('reports feedback undo without changing the legacy selection callback contract', async () => {
	const legacy: string[] = [];
	const updates: (string | null)[] = [];
	const view = await render(MessageActions, {
		onFeedback: (value) => {
			legacy.push(value);
		},
		onFeedbackChange: (value) => {
			updates.push(value);
		}
	});
	const up = view.container.querySelector<HTMLButtonElement>('[aria-label="Good response"]')!;
	up.click();
	await expect.poll(() => up.getAttribute('aria-pressed')).toBe('true');
	up.click();
	await expect.poll(() => up.getAttribute('aria-pressed')).toBe('false');
	expect(legacy).toEqual(['up']);
	expect(updates).toEqual(['up', null]);
});

it('shows copy rejection without reporting success', async () => {
	const view = await render(MessageActions, {
		onCopy: async () => {
			throw new Error('clipboard unavailable');
		}
	});
	view.container.querySelector('button')!.click();
	await expect
		.poll(() => view.container.querySelector('[role="alert"]')?.textContent)
		.toContain('Copy failed');
	expect(view.container.querySelector('button')?.getAttribute('aria-label')).toBe('Copy');
});

it('upload cancellation remains available while an async send is pending', async () => {
	const file = new File(['data'], 'draft.txt');
	let cancel = 0;
	let finish: () => void = () => {};
	// Queued status permits onSend to start; a parent normally changes it to uploading during transport.
	const view = await render(Composer, {
		value: 'send',
		attachments: true,
		files: [file],
		onSend: () =>
			new Promise<void>((resolve) => {
				finish = resolve;
			})
	});
	view.container.querySelector<HTMLButtonElement>('[data-slot="chat-send-button"]')!.click();
	await expect.poll(() => view.container.querySelector('textarea')!.disabled).toBe(true);
	await view.rerender({
		value: 'send',
		attachments: true,
		files: [file],
		uploads: [{ file, status: 'uploading', progress: 20 }],
		onCancelUpload: () => {
			cancel++;
		}
	});
	const button = view.container.querySelector<HTMLButtonElement>(
		'[aria-label="Cancel upload: draft.txt"]'
	)!;
	expect(button.disabled).toBe(false);
	button.click();
	expect(cancel).toBe(1);
	finish();
});

it('conversation retry catches failures and allows another request', async () => {
	let calls = 0;
	const view = await render(Root, {
		state: 'error',
		isEmpty: true,
		onRetry: async () => {
			calls++;
			throw new Error('offline');
		}
	});
	expect(view.container.querySelector('[data-slot="chat-empty"]')).toBeNull();
	const retry = view.container.querySelector('button')!;
	retry.click();
	await expect.poll(() => retry.disabled).toBe(false);
	expect(calls).toBe(1);
	expect(view.container.querySelector('[role="alert"]')?.textContent).toContain('Could not load');
	retry.click();
	await expect.poll(() => calls).toBe(2);
});
