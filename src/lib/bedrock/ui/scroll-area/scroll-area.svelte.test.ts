import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './scroll-area.test.svelte';

afterEach(() => cleanup());

describe('ScrollArea edge lifecycle', () => {
	it('updates physical horizontal edges when direction changes without a scroll', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-testid="direction"]')!;
		await vi.waitFor(() => expect(root.dataset.scrollRightHidden).toBe('true'));
		expect(root.dataset.scrollLeftHidden).toBe('false');
		await view.getByRole('button', { name: 'Toggle direction' }).click();
		await vi.waitFor(() => expect(root.dataset.scrollLeftHidden).toBe('true'));
		expect(root.dataset.scrollRightHidden).toBe('false');
	});

	it('tracks inserted and removed overflow inside a fixed-size content shell', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-testid="async-content"]')!;
		const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('false'));
		await view.getByRole('button', { name: 'Toggle async content' }).click();
		expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('true'));
		await view.getByRole('button', { name: 'Toggle async content' }).click();
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('false'));
	});

	it('isolates nested scroll edges and clears both decorations for nested focus', async () => {
		const view = await render(Fixture);
		const outer = view.container.querySelector<HTMLElement>('[data-testid="outer"]')!;
		const inner = view.container.querySelector<HTMLElement>('[data-testid="inner"]')!;
		const viewport = inner.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		await vi.waitFor(() => expect(inner.dataset.scrollBottomHidden).toBe('true'));
		viewport.scrollTop = 30;
		await vi.waitFor(() => expect(inner.dataset.scrollTopHidden).toBe('true'));
		expect(outer.dataset.scrollTopHidden).toBe('false');
		inner.querySelector<HTMLButtonElement>('button')!.focus();
		for (const layer of outer.querySelectorAll('[data-blur-layer]')) {
			expect(getComputedStyle(layer).opacity).toBe('0');
			expect(getComputedStyle(layer).transitionDuration).toBe('0s');
		}
	});

	it('removes scroll and content observers when the component unmounts', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-testid="direction"]')!;
		const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('true'));
		await cleanup();
		root.dataset.scrollBottomHidden = 'unmounted';
		viewport.dispatchEvent(new Event('scroll'));
		viewport.append(document.createElement('div'));
		root.setAttribute('dir', 'rtl');
		await new Promise<void>((resolve) =>
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		);
		expect(root.dataset.scrollBottomHidden).toBe('unmounted');
	});
});
