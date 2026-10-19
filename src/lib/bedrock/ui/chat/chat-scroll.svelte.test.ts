import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './chat-scroll.test.svelte';

afterEach(() => {
	vi.restoreAllMocks();
	cleanup();
});

it('finishes an explicit scroll on live reduction and leaves ordinary history reading in place', async () => {
	const view = await render(Fixture);
	const viewport = view.container.querySelector<HTMLElement>(
		'[data-slot="chat-message-viewport"]'
	)!;
	await expect.poll(() => viewport.scrollTop).toBeGreaterThan(0);
	viewport.scrollTop = 0;
	flushSync(() => viewport.dispatchEvent(new Event('scroll')));
	const nativeScroll = viewport.scrollTo.bind(viewport);
	const scroll = vi
		.spyOn(viewport, 'scrollTo')
		.mockImplementation((options: ScrollToOptions | number, y?: number) => {
			if (typeof options === 'number') nativeScroll(options, y ?? 0);
			else if (options.behavior !== 'smooth') nativeScroll(options);
		});
	await view.getByRole('button', { name: 'Scroll to bottom' }).click();
	expect(scroll).toHaveBeenLastCalledWith({ top: viewport.scrollHeight, behavior: 'smooth' });
	await view.rerender({ reduced: true });
	expect(scroll).toHaveBeenLastCalledWith({ top: viewport.scrollHeight, behavior: 'instant' });
	expect(viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop).toBeLessThanOrEqual(1);
	await view.rerender({ reduced: false });
	viewport.scrollTop = 120;
	flushSync(() => viewport.dispatchEvent(new Event('scroll')));
	scroll.mockClear();
	await view.rerender({ reduced: true });
	expect(scroll).not.toHaveBeenCalled();
	expect(viewport.scrollTop).toBe(120);
});
