import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import ActivityItem from './chat-activity-item.svelte';
import Activity from './chat-activity.svelte';
import ToolCalls from './chat-tool-calls.svelte';
import MessageActions from './chat-message-actions.svelte';

afterEach(() => cleanup());

it('renders non-expandable activity as text and exposes the same localized lifecycle in both wrappers', async () => {
	const item = await render(ActivityItem, { title: 'Queued task', status: 'pending' });
	expect(item.container.querySelector('button')).toBeNull();
	expect(item.container.textContent).toContain('Pending');
	const activity = await render(Activity, {
		steps: [{ id: 'task', title: 'Search', status: 'running' }],
		statusLabels: { running: 'In progress' }
	});
	const tools = await render(ToolCalls, {
		calls: [{ key: 'tool', name: 'Search', status: 'running' }],
		statusLabels: { running: 'In progress' }
	});
	for (const view of [activity, tools]) {
		expect(view.container.querySelector('[data-status="running"]')?.textContent).toContain(
			'In progress'
		);
		expect(view.container.querySelector('.animate-spin')).not.toBeNull();
	}
});

it('preserves a tool disclosure by stable key across reordering and streaming status changes', async () => {
	const calls = [
		{ key: 'a', name: 'Read A', detail: 'Result A' },
		{ key: 'b', name: 'Read B', detail: 'Result B' }
	];
	const view = await render(ToolCalls, { calls, expanded: true });
	const first = view.container.querySelector<HTMLButtonElement>(
		'[data-slot="chat-tool-call"] button'
	)!;
	first.click();
	await expect.poll(() => first.getAttribute('aria-expanded')).toBe('true');
	await view.rerender({ calls: [calls[1], { ...calls[0], status: 'running' }], expanded: true });
	const rows = view.container.querySelectorAll('[data-slot="chat-tool-call"]');
	expect(rows[0].querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
	expect(rows[1].querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
	expect(rows[1].getAttribute('data-status')).toBe('running');
	await expect.poll(() => rows[1].textContent).toContain('Result A');
});

it('keeps tool errors visible without requiring a disclosure', async () => {
	const view = await render(ActivityItem, {
		title: 'Search',
		status: 'error',
		error: 'Network unavailable'
	});
	expect(view.container.querySelector('button')).toBeNull();
	expect(view.container.textContent).toContain('Network unavailable');
});

it('locks message retry until settled, reports failure, and permits recovery', async () => {
	let calls = 0;
	let reject: (reason: Error) => void = () => {};
	const view = await render(MessageActions, {
		onRetry: () => {
			calls++;
			if (calls === 1)
				return new Promise<void>((_, no) => {
					reject = no;
				});
		}
	});
	const retry = view.container.querySelector<HTMLButtonElement>('[aria-label="Retry"]')!;
	retry.click();
	retry.click();
	await expect.poll(() => retry.disabled).toBe(true);
	expect(calls).toBe(1);
	reject(new Error('Offline'));
	await expect
		.poll(() => view.container.querySelector('[role="alert"]')?.textContent)
		.toContain('Retry failed');
	retry.click();
	await expect.poll(() => calls).toBe(2);
	await expect.poll(() => view.container.querySelector('[role="alert"]')).toBeNull();
});

it('commits feedback only after persistence succeeds and retains the old rating on failure', async () => {
	let calls = 0;
	let reject: (reason: Error) => void = () => {};
	const view = await render(MessageActions, {
		feedback: 'up',
		onFeedbackChange: (rating) => {
			expect(rating).toBe('down');
			calls++;
			if (calls === 1)
				return new Promise<void>((_, no) => {
					reject = no;
				});
		}
	});
	const up = view.container.querySelector<HTMLButtonElement>('[aria-label="Good response"]')!;
	const down = view.container.querySelector<HTMLButtonElement>('[aria-label="Bad response"]')!;
	down.click();
	down.click();
	await expect.poll(() => down.disabled).toBe(true);
	expect(calls).toBe(1);
	reject(new Error('Offline'));
	await expect.poll(() => down.disabled).toBe(false);
	expect(up.getAttribute('aria-pressed')).toBe('true');
	expect(down.getAttribute('aria-pressed')).toBe('false');
	expect(view.container.querySelector('[role="alert"]')?.textContent).toContain(
		'Could not save feedback'
	);
	down.click();
	await expect.poll(() => down.getAttribute('aria-pressed')).toBe('true');
	expect(up.getAttribute('aria-pressed')).toBe('false');
});

it('retains open tool detail when a stream grows from one call to a grouped list', async () => {
	const first = { key: 'first', name: 'Read first', detail: 'First result' };
	const view = await render(ToolCalls, { calls: [first], expanded: true });
	view.container.querySelector<HTMLButtonElement>('[data-slot="chat-tool-call"] button')!.click();
	await expect
		.poll(() =>
			view.container
				.querySelector('[data-slot="chat-tool-call"] button')
				?.getAttribute('aria-expanded')
		)
		.toBe('true');
	await view.rerender({
		calls: [first, { key: 'second', name: 'Read second', detail: 'Second result' }],
		expanded: true
	});
	await expect
		.poll(() => view.container.querySelectorAll('[data-slot="chat-tool-call"]').length)
		.toBe(2);
	const rows = view.container.querySelectorAll('[data-slot="chat-tool-call"]');
	expect(rows[0].querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
	expect(rows[1].querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
});
