import { afterEach, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './css-size.test.svelte';

afterEach(() => cleanup());

it('uses Astra CSS to resize actual geometry without scaling the content', async () => {
	const view = await render(Fixture);
	const shell = view.container.querySelector<HTMLElement>('[data-testid="size-shell"]')!;
	const content = view.container.querySelector<HTMLElement>('[data-testid="size-copy"]')!;
	await expect.poll(() => Number.parseFloat(shell.style.width)).toBe(content.offsetWidth);
	const start = shell.getBoundingClientRect().width;
	view.container.querySelector<HTMLButtonElement>('button')!.click();
	await expect
		.poll(() => {
			const width = shell.getBoundingClientRect().width;
			return width > start && width < content.offsetWidth;
		})
		.toBe(true);
	expect(getComputedStyle(content).transform).toBe('none');
	expect(getComputedStyle(content).scale).toBe('none');
	await expect
		.poll(() => Math.round(shell.getBoundingClientRect().width))
		.toBe(content.offsetWidth);
	await view.getByRole('button', { name: 'Reduce sizing motion' }).click();
	await view.getByRole('button', { name: 'Resize content' }).click();
	await expect.poll(() => shell.getBoundingClientRect().width).toBe(content.offsetWidth);
	expect(getComputedStyle(shell).transitionProperty).toBe('none');
});
