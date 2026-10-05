import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './motion.test.svelte';

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
afterEach(() => cleanup());

describe('Album motion policy', () => {
	for (const delay of [0, 1000]) {
		it(`settles active or delayed content when application reduction changes (delay ${delay})`, async () => {
			const view = await render(Fixture, { delay });
			flushSync(() => view.component.show());
			await frame();
			const copy = view.container.querySelector<HTMLElement>('[data-testid="album-copy"]')!;
			expect(copy.getAnimations().length).toBeGreaterThan(0);
			flushSync(() => view.component.reduce());
			await expect.poll(() => getComputedStyle(copy).opacity).toBe('1');
			await expect
				.poll(
					() => copy.getAnimations().filter((animation) => animation.playState === 'running').length
				)
				.toBe(0);
		});
	}
});
