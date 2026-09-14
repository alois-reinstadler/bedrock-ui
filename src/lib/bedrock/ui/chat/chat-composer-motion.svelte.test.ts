import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync, tick } from 'svelte';
import Fixture from './chat-composer-motion.test.svelte';

afterEach(() => cleanup());

describe('ChatComposer motion geometry', () => {
	it('overlaps outgoing and incoming controls without shrinking the textarea', async () => {
		const view = await render(Fixture);
		const textarea = view.container.querySelector('textarea');
		const toggle = view.container.querySelector('button');
		if (!textarea || !toggle) throw new Error('Composer fixture not mounted');
		const width = textarea.getBoundingClientRect().width;
		flushSync(() => toggle.click());
		await tick();
		const send = view.container.querySelector<HTMLElement>('[data-slot="chat-send-button"]');
		const stop = view.container.querySelector<HTMLElement>('[data-slot="chat-stop-button"]');
		expect(send).not.toBeNull();
		expect(stop).not.toBeNull();
		expect(textarea.getBoundingClientRect().width).toBeCloseTo(width, 1);
		if (send && stop) {
			expect(send.getBoundingClientRect().left).toBeCloseTo(stop.getBoundingClientRect().left, 1);
			expect(send.closest('[inert]')).not.toBeNull();
		}
	});
});
