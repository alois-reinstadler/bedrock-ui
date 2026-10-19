import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { flushSync } from 'svelte';
import Fixture from './HeroPlayground.test.svelte';

afterEach(() => cleanup());

it('settles previous pointer tilt on live application reduction and does not replay it', async () => {
	const view = await render(Fixture);
	const scene = document.querySelector<HTMLElement>('.constellation')!;
	const move = () => {
		const box = scene.getBoundingClientRect();
		scene.dispatchEvent(
			new PointerEvent('pointermove', {
				pointerType: 'mouse',
				bubbles: true,
				clientX: box.right - 1,
				clientY: box.bottom - 1
			})
		);
	};
	move();
	expect(parseFloat(scene.style.getPropertyValue('--scene-x'))).toBeGreaterThan(0);
	flushSync(() => view.component.reduce(true));
	await expect.poll(() => scene.dataset.reducedMotion).toBe('true');
	expect(scene.style.getPropertyValue('--scene-x')).toBe('0deg');
	expect(scene.style.getPropertyValue('--scene-y')).toBe('0deg');
	move();
	expect(scene.style.getPropertyValue('--scene-x')).toBe('0deg');
	flushSync(() => view.component.reduce(false));
	await expect.poll(() => scene.dataset.reducedMotion).toBe('false');
	expect(scene.style.getPropertyValue('--scene-x')).toBe('0deg');
	move();
	expect(parseFloat(scene.style.getPropertyValue('--scene-x'))).toBeGreaterThan(0);
});
