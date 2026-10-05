import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { userEvent } from 'vitest/browser';
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

	it('isolates nested scroll edges and clears both decorations for nested keyboard focus', async () => {
		const view = await render(Fixture);
		const outer = view.container.querySelector<HTMLElement>('[data-testid="outer"]')!;
		const inner = view.container.querySelector<HTMLElement>('[data-testid="inner"]')!;
		const viewport = inner.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		await vi.waitFor(() => expect(inner.dataset.scrollBottomHidden).toBe('true'));
		viewport.scrollTop = 30;
		await vi.waitFor(() => expect(inner.dataset.scrollTopHidden).toBe('true'));
		expect(outer.dataset.scrollTopHidden).toBe('false');
		viewport.focus();
		await userEvent.keyboard('{Tab}');
		const button = inner.querySelector<HTMLButtonElement>('button')!;
		expect(document.activeElement).toBe(button);
		expect(button.matches(':focus-visible')).toBe(true);
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

describe('ScrollArea boolean edgeBlur', () => {
	it('defaults to disabled and can enable, disable, and re-enable at the current position', async () => {
		const view = await render(Fixture);
		const root = view.container.querySelector<HTMLElement>('[data-testid="automatic"]')!;
		const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		expect(root.querySelectorAll('[data-scroll-edge]')).toHaveLength(0);
		viewport.scrollTop = 40;
		await view.rerender({ edgeBlur: true });
		await vi.waitFor(() => expect(root.dataset.scrollTopHidden).toBe('true'));
		expect(root.dataset.scrollBottomHidden).toBe('true');
		expect(root.querySelectorAll('[data-scroll-edge]')).toHaveLength(2);
		await view.rerender({ edgeBlur: false });
		await vi.waitFor(() => expect(root.dataset.scrollTopHidden).toBe('false'));
		expect(root.dataset.scrollBottomHidden).toBe('false');
		expect(root.querySelectorAll('[data-scroll-edge]')).toHaveLength(0);
		await view.rerender({ edgeBlur: true });
		await vi.waitFor(() => expect(root.dataset.scrollTopHidden).toBe('true'));
	});

	it('follows orientation changes and preserves explicit axis overrides', async () => {
		const view = await render(Fixture, { edgeBlur: true });
		const root = view.container.querySelector<HTMLElement>('[data-testid="automatic"]')!;
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('true'));
		expect(root.dataset.scrollRightHidden).toBe('false');
		await view.rerender({ orientation: 'horizontal' });
		await vi.waitFor(() => expect(root.dataset.scrollRightHidden).toBe('true'));
		expect(root.dataset.scrollBottomHidden).toBe('false');
		expect(root.querySelector('[data-scroll-edge="top"]')).toBeNull();
		await view.rerender({ orientation: 'both' });
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('true'));
		expect(root.querySelectorAll('[data-scroll-edge]')).toHaveLength(4);
		await view.rerender({ edgeBlur: 'vertical' });
		await vi.waitFor(() => expect(root.dataset.scrollRightHidden).toBe('false'));
		expect(root.dataset.scrollBottomHidden).toBe('true');
		expect(root.querySelectorAll('[data-scroll-edge]')).toHaveLength(2);
	});

	it('hides reached boundaries and recalculates when the viewport grows to fit', async () => {
		const view = await render(Fixture, { edgeBlur: true, orientation: 'both' });
		const root = view.container.querySelector<HTMLElement>('[data-testid="automatic"]')!;
		const viewport = root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!;
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('true'));
		expect(root.dataset.scrollRightHidden).toBe('true');
		expect(root.dataset.scrollTopHidden).toBe('false');
		expect(root.dataset.scrollLeftHidden).toBe('false');
		viewport.scrollTo(viewport.scrollWidth, viewport.scrollHeight);
		await vi.waitFor(() => expect(root.dataset.scrollBottomHidden).toBe('false'));
		expect(root.dataset.scrollRightHidden).toBe('false');
		expect(root.dataset.scrollTopHidden).toBe('true');
		expect(root.dataset.scrollLeftHidden).toBe('true');
		root.style.height = '400px';
		root.style.width = '600px';
		await vi.waitFor(() => {
			for (const side of ['Top', 'Bottom', 'Left', 'Right']) {
				expect(root.dataset[`scroll${side}Hidden`]).toBe('false');
			}
		});
	});
});

function wheel(viewport: HTMLElement, init: WheelEventInit = {}) {
	const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 40, ...init });
	viewport.dispatchEvent(event);
	return event;
}

function viewportIn(container: HTMLElement, id: string) {
	return container.querySelector<HTMLElement>(
		`[data-testid="${id}"] [data-slot="scroll-area-viewport"]`
	)!;
}

describe('ScrollArea wheelToHorizontal', () => {
	it('is opt-in, reacts to prop changes, and only applies to a horizontal axis', async () => {
		const view = await render(Fixture, { orientation: 'horizontal' });
		view.container.dataset.bedrockMotion = 'reduced';
		const viewport = viewportIn(view.container, 'automatic');
		expect(wheel(viewport).defaultPrevented).toBe(false);
		expect(viewport.scrollLeft).toBe(0);
		await view.rerender({ wheelToHorizontal: true });
		expect(wheel(viewport).defaultPrevented).toBe(true);
		expect(viewport.scrollLeft).toBe(40);
		await view.rerender({ wheelToHorizontal: false });
		expect(wheel(viewport).defaultPrevented).toBe(false);
		expect(viewport.scrollLeft).toBe(40);
		await view.rerender({ wheelToHorizontal: true, orientation: 'vertical' });
		expect(wheel(viewport).defaultPrevented).toBe(false);
		await view.rerender({ orientation: 'both' });
		expect(wheel(viewport).defaultPrevented).toBe(true);
		expect(viewport.scrollTop).toBe(0);
	});

	it('normalizes line and page deltas and releases input at both boundaries or without overflow', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		view.container.dataset.bedrockMotion = 'reduced';
		const viewport = viewportIn(view.container, 'automatic');
		viewport.style.lineHeight = '20px';
		expect(wheel(viewport, { deltaY: -40 }).defaultPrevented).toBe(false);
		wheel(viewport, { deltaY: 2, deltaMode: WheelEvent.DOM_DELTA_LINE });
		expect(viewport.scrollLeft).toBe(40);
		wheel(viewport, { deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_PAGE });
		expect(viewport.scrollLeft).toBe(40 + viewport.clientWidth);
		wheel(viewport, { deltaY: 9999 });
		expect(viewport.scrollLeft).toBe(viewport.scrollWidth - viewport.clientWidth);
		expect(wheel(viewport).defaultPrevented).toBe(false);
		expect(wheel(viewport, { deltaY: -9999 }).defaultPrevented).toBe(true);
		expect(viewport.scrollLeft).toBe(0);
		viewport.parentElement!.style.width = '600px';
		expect(wheel(viewport).defaultPrevented).toBe(false);
	});

	it('preserves horizontal, modified, canceled, and noncancelable wheel gestures', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		view.container.dataset.bedrockMotion = 'reduced';
		const viewport = viewportIn(view.container, 'automatic');
		for (const init of [
			{ deltaX: 15 },
			{ ctrlKey: true },
			{ metaKey: true },
			{ altKey: true },
			{ shiftKey: true },
			{ cancelable: false },
			{ deltaY: 0 }
		]) {
			expect(wheel(viewport, init).defaultPrevented).toBe(false);
			expect(viewport.scrollLeft).toBe(0);
		}
		const canceled = new WheelEvent('wheel', { cancelable: true, deltaY: 40 });
		canceled.preventDefault();
		viewport.dispatchEvent(canceled);
		expect(viewport.scrollLeft).toBe(0);
	});

	it('moves forward and backward in RTL and updates the corresponding blur edges', async () => {
		const view = await render(Fixture);
		view.container.dataset.bedrockMotion = 'reduced';
		await view.getByRole('button', { name: 'Toggle direction' }).click();
		const viewport = viewportIn(view.container, 'direction');
		const root = viewport.parentElement!;
		expect(wheel(viewport).defaultPrevented).toBe(true);
		expect(viewport.scrollLeft).toBe(-40);
		await vi.waitFor(() => expect(root.dataset.scrollRightHidden).toBe('true'));
		wheel(viewport, { deltaY: 9999 });
		await vi.waitFor(() => expect(root.dataset.scrollLeftHidden).toBe('false'));
		expect(wheel(viewport).defaultPrevented).toBe(false);
		wheel(viewport, { deltaY: -9999 });
		expect(viewport.scrollLeft).toBe(0);
		expect(wheel(viewport, { deltaY: -40 }).defaultPrevented).toBe(false);
	});

	it('does not hijack nested viewports and detaches on unmount', async () => {
		const view = await render(Fixture);
		view.container.dataset.bedrockMotion = 'reduced';
		const outer = viewportIn(view.container, 'wheel-outer');
		const inner = viewportIn(view.container, 'wheel-inner');
		expect(wheel(inner).defaultPrevented).toBe(false);
		expect(outer.scrollLeft).toBe(0);
		expect(wheel(outer).defaultPrevented).toBe(true);
		await cleanup();
		expect(wheel(outer).defaultPrevented).toBe(false);
	});
});

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

describe('ScrollArea browser-controlled wheel motion', () => {
	it('eases through intermediate positions and accumulates rapid wheel ticks', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 60 });
		wheel(viewport, { deltaY: 60 });
		wheel(viewport, { deltaY: 60 });
		expect(viewport.scrollLeft).toBe(0);
		const positions: number[] = [];
		while (viewport.scrollLeft !== 180 && positions.length < 120) {
			await nextFrame();
			positions.push(viewport.scrollLeft);
		}
		expect(positions.some((position) => position > 0 && position < 180)).toBe(true);
		expect(positions.at(-1)).toBe(180);
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
	});

	it('retargets an in-flight browser scroll without losing later wheel ticks', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 60 });
		await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0));
		wheel(viewport, { deltaY: 60 });
		await nextFrame();
		await nextFrame();
		wheel(viewport, { deltaY: 60 });
		await vi.waitFor(() => expect(viewport.scrollLeft).toBe(180));
	});

	it('reverses from the visible position instead of finishing queued forward travel', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 200 });
		await vi.waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(20));
		const before = viewport.scrollLeft;
		wheel(viewport, { deltaY: -20 });
		await vi.waitFor(() => expect(viewport.scrollLeft).toBe(before - 20));
	});

	it('yields to external scrolling and cancels ongoing motion when disabled', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 120 });
		await nextFrame();
		viewport.scrollLeft = 250;
		await nextFrame();
		await nextFrame();
		expect(viewport.scrollLeft).toBe(250);
		wheel(viewport, { deltaY: -120 });
		await nextFrame();
		await view.rerender({ wheelToHorizontal: false });
		const stopped = viewport.scrollLeft;
		await nextFrame();
		await nextFrame();
		expect(viewport.scrollLeft).toBe(stopped);
	});

	it('settles immediately if reduced motion is enabled during scrolling', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 120 });
		view.container.dataset.bedrockMotion = 'reduced';
		await nextFrame();
		expect(viewport.scrollLeft).toBe(120);
	});

	it('cancels queued movement when switching to native horizontal gestures or dragging', async () => {
		const view = await render(Fixture, { orientation: 'horizontal', wheelToHorizontal: true });
		const viewport = viewportIn(view.container, 'automatic');
		wheel(viewport, { deltaY: 120 });
		wheel(viewport, { deltaX: 30 });
		await nextFrame();
		expect(viewport.scrollLeft).toBe(0);
		wheel(viewport, { deltaY: 120 });
		viewport.parentElement!.dispatchEvent(new PointerEvent('pointerdown'));
		await nextFrame();
		expect(viewport.scrollLeft).toBe(0);
	});
});
