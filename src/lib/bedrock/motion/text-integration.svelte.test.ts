import { afterEach, expect, it } from 'vitest';
import { render, cleanup } from 'vitest-browser-svelte';
import { tick } from 'svelte';
import Example from '../../site/guide-examples/motion-text.svelte';

afterEach(cleanup);

it('uses the packed word contract and preserves reserved geometry and surrounding input', async () => {
	const { container } = render(Example);
	await tick();
	const reveal = container.querySelector('[data-testid="text-reveal"]')!;
	expect(
		[...reveal.querySelectorAll('[data-text-fragment]')].map((node) => node.textContent)
	).toEqual(['Make', 'it', 'clear.']);
	const swap = container.querySelector<HTMLElement>('[data-testid="text-swap"]')!;
	const input = container.querySelector<HTMLInputElement>('input')!;
	input.value = 'Retained note';
	input.focus();
	const before = swap.getBoundingClientRect().height;
	const next = container.querySelector<HTMLButtonElement>('[data-testid="text-next"]')!;
	next.click();
	await tick();
	next.click();
	await tick();
	await expect
		.poll(() => [...swap.querySelectorAll('[data-text-layer]')].map((node) => node.textContent), {
			timeout: 5000
		})
		.toEqual(['Hello, 世界. A new message, in the same space.']);
	expect(swap.getBoundingClientRect().height).toBeCloseTo(before, 1);
	expect(container.querySelector('input')).toBe(input);
	expect(input.value).toBe('Retained note');
	expect(document.activeElement).toBe(input);
	expect(swap.querySelectorAll('[aria-live]')).toHaveLength(1);
});

it('honors the Bedrock application policy during a text replacement', async () => {
	const { container } = render(Example);
	await tick();
	container.querySelector<HTMLButtonElement>('[data-testid="text-next"]')!.click();
	await tick();
	container.querySelector<HTMLButtonElement>('[data-testid="text-reduce"]')!.click();
	await tick();
	const swap = container.querySelector('[data-testid="text-swap"]')!;
	await expect.poll(() => swap.querySelectorAll('[data-text-layer]').length).toBe(1);
	expect(swap.querySelector('[data-text-layer]')!.textContent).toBe(
		'Keep your place while a longer message wraps naturally onto another line.'
	);
	for (const fragment of container.querySelectorAll<HTMLElement>('[data-text-fragment]')) {
		expect(getComputedStyle(fragment).opacity).toBe('1');
		expect(fragment.getAnimations()).toHaveLength(0);
	}
});
