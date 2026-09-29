import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Approval from './chat-approval.svelte';
import Recommendation from './chat-recommendation.svelte';
import ChangeReview from './chat-change-review.svelte';
afterEach(() => cleanup());

it('locks approval immediately against duplicate clicks and retains pending state after rejection', async () => {
	let reject: (reason?: unknown) => void = () => {};
	let calls = 0;
	const view = await render(Approval, {
		title: 'Execute?',
		onDecide: () => {
			calls++;
			if (calls === 1)
				return new Promise<void>((_, no) => {
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
		.toContain('Could not save');
	expect(view.container.querySelector('[role="status"]')?.textContent).toBe('');
	button.click();
	await expect
		.poll(() => view.container.querySelector('[role="status"]')?.textContent)
		.toBe('Approved');
	expect(calls).toBe(2);
});

it('sends the selected recommendation only once while acceptance is pending', async () => {
	let calls = 0;
	let resolve = () => {};
	const view = await render(Recommendation, {
		title: 'Choose',
		value: 'one',
		options: [{ id: 'one', title: 'One' }],
		onAccept: (option) => {
			expect(option.id).toBe('one');
			calls++;
			return new Promise<void>((yes) => {
				resolve = yes;
			});
		}
	});
	const button = view.container.querySelector<HTMLButtonElement>(
		'[data-slot="chat-recommendation-accept"]'
	)!;
	button.click();
	button.click();
	await expect.poll(() => button.disabled).toBe(true);
	expect(calls).toBe(1);
	resolve();
	await expect
		.poll(() => view.container.querySelector('[role="status"]')?.textContent)
		.toBe('Recommendation accepted');
});

it('filters stale review selections and never applies unselected changes', async () => {
	let applied: string[] = [];
	const view = await render(ChangeReview, {
		selected: ['one', 'stale'],
		changes: [
			{ id: 'one', title: 'First', before: 'a', after: 'b' },
			{ id: 'two', title: 'Second', before: 'c', after: 'd' }
		],
		onApply: (changes) => {
			applied = changes.map((change) => change.id);
		}
	});
	view.container.querySelector<HTMLButtonElement>('[data-slot="chat-change-apply"]')!.click();
	await expect.poll(() => applied).toEqual(['one']);
	await expect
		.poll(() => view.container.querySelector('[role="status"]')?.textContent)
		.toBe('Changes applied');
});
