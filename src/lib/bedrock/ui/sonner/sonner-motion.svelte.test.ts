import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import { toast } from 'svelte-sonner';
import Fixture from './sonner-motion.test.svelte';

afterEach(async () => {
	toast.dismiss();
	await cleanup();
});
const mutations = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function element<T extends HTMLElement>(root: Element, selector: string): T {
	const node = root.querySelector<T>(selector);
	if (!node) throw new Error(`Missing ${selector}`);
	return node;
}

async function show(reduced: boolean, id: string) {
	const view = await render(Fixture, { props: { reduced, id } });
	const trigger = element<HTMLButtonElement>(view.container, '[data-show]');
	trigger.focus();
	flushSync(() => trigger.click());
	await mutations();
	return {
		view,
		trigger,
		notification: element<HTMLElement>(view.container, '[data-sonner-toast]')
	};
}

describe('Sonner retained exits', () => {
	it.each([false, true])(
		'retires dismissed controls and returns owned focus (reduced=%s)',
		async (reduced) => {
			const { trigger, notification } = await show(reduced, `toast-focus-${reduced}`);
			const close = element<HTMLButtonElement>(notification, '[data-close-button]');
			close.focus();
			flushSync(() => close.click());
			await mutations();
			expect(notification.isConnected).toBe(true); // Sonner still owns its retained exit.
			expect(notification.dataset.removed).toBe('true');
			expect(notification.inert).toBe(true);
			expect(notification.getAttribute('aria-hidden')).toBe('true');
			if (reduced) expect(getComputedStyle(notification).transitionDuration).toBe('0s');
			expect(document.activeElement).toBe(trigger);
		}
	);

	it('preserves outside focus and restores accessibility when the same toast is revived', async () => {
		const id = 'toast-revive';
		const { view, notification } = await show(true, id);
		const outside = element<HTMLButtonElement>(view.container, '[data-outside]');
		outside.focus();
		flushSync(() => toast.dismiss(id));
		await mutations();
		expect(notification.inert).toBe(true);
		expect(document.activeElement).toBe(outside);
		flushSync(() => toast('Restored toast', { id, toasterId: id, duration: Infinity }));
		await mutations();
		const current = element<HTMLElement>(view.container, '[data-sonner-toast]');
		expect(current.inert).toBe(false);
		expect(current.hasAttribute('aria-hidden')).toBe(false);
		expect(document.activeElement).toBe(outside);
	});
});
