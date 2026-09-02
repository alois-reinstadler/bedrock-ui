import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './async-button.test.svelte';

afterEach(() => cleanup());

function deferred() {
	let resolve!: () => void;
	let reject!: (reason?: unknown) => void;
	const promise = new Promise<void>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

const settle = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function parts(container: Element) {
	const button = container.querySelector<HTMLButtonElement>('[data-slot="async-button"]');
	const status = container.querySelector<HTMLElement>('[data-slot="async-button-status"]');
	if (!button || !status) throw new Error('AsyncButton parts not found');
	return { button, status };
}

describe('AsyncButton', () => {
	it('runs the action on click, shows aria-busy, then success, then resets', async () => {
		const gate = deferred();
		let calls = 0;
		const view = await render(Fixture, {
			props: {
				action: () => {
					calls += 1;
					return gate.promise;
				},
				resetAfter: 40
			}
		});
		const { button } = parts(view.container);

		button.click();
		await settle();
		expect(calls).toBe(1);
		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(button.getAttribute('aria-disabled')).toBe('true');

		// Idle-only clicks by default: a second click during pending is ignored.
		button.click();
		await settle();
		expect(calls).toBe(1);

		gate.resolve();
		await settle(10);
		expect(button.dataset.state).toBe('success');
		expect(view.container.textContent).toContain('Done');

		await settle(200);
		expect(button.dataset.state).toBe('idle');
		expect(button.getAttribute('aria-busy')).toBeNull();
		expect(button.getAttribute('aria-disabled')).toBeNull();
	});

	it('reports rejections through onError and shows the error label', async () => {
		const boom = new Error('nope');
		let reported: unknown;
		const view = await render(Fixture, {
			props: {
				action: () => Promise.reject(boom),
				onError: (error: unknown) => (reported = error),
				resetAfter: 40
			}
		});
		const { button } = parts(view.container);

		button.click();
		await settle(10);
		expect(reported).toBe(boom);
		expect(button.dataset.state).toBe('error');
		expect(view.container.textContent).toContain('Failed');
	});

	it('announces state changes through the status live region', async () => {
		const gate = deferred();
		const view = await render(Fixture, {
			props: { action: () => gate.promise, resetAfter: 40 }
		});
		const { button, status } = parts(view.container);

		expect(status.textContent?.trim()).toBe('');
		button.click();
		await settle();
		expect(status.textContent).toContain('Working…');

		gate.resolve();
		await settle(10);
		expect(status.textContent).toContain('Done');

		await settle(200);
		expect(status.textContent?.trim()).toBe('');
	});

	it('re-invokes the action on click while pending when interruptible', async () => {
		let calls = 0;
		const gates = [deferred(), deferred()];
		const view = await render(Fixture, {
			props: {
				action: () => gates[calls++].promise,
				interruptible: true,
				resetAfter: 40
			}
		});
		const { button } = parts(view.container);

		button.click();
		await settle();
		expect(button.getAttribute('aria-disabled')).toBeNull();
		button.click();
		await settle();
		expect(calls).toBe(2);

		// The superseded first run settling must not change the shown state.
		gates[0].resolve();
		await settle(10);
		expect(button.dataset.state).toBe('pending');
	});

	it('does not run the action when disabled', async () => {
		let calls = 0;
		const view = await render(Fixture, {
			props: {
				action: () => {
					calls += 1;
					return Promise.resolve();
				},
				disabled: true
			}
		});
		const { button } = parts(view.container);

		expect(button.disabled).toBe(true);
		button.click();
		await settle();
		expect(calls).toBe(0);
		expect(button.dataset.state).toBe('idle');
	});
});
