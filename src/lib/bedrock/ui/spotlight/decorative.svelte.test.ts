import { afterEach, describe, expect, it } from 'vitest';
import { render, cleanup } from 'vitest-browser-svelte';
import { tick } from 'svelte';
import Fixture from './decorative.test.svelte';
import Marquee from '../marquee/marquee.svelte';

afterEach(cleanup);
function element(container: Element, selector: string): HTMLElement {
	const result = container.querySelector<HTMLElement>(selector);
	if (!result) throw new Error(`Missing ${selector}`);
	return result;
}
describe('decorative interactions', () => {
	it('settles loading decoration live and does not replay a completed highlight', async () => {
		const { container } = await render(Fixture);
		element(container, 'button').click();
		await tick();
		for (const selector of [
			'[data-slot="skeleton"]',
			'[data-slot="skeleton-group"]',
			'[role="status"]',
			'[data-slot="status-dot"]',
			'[data-slot="text-shimmer"]',
			'[data-slot="text-highlight"]'
		]) {
			expect(getComputedStyle(element(container, selector)).animationName).toBe('none');
		}
		expect(element(container, '[data-slot="text-shimmer"]').textContent).toBe('Loading details');
		element(container, 'button').click();
		await tick();
		expect(getComputedStyle(element(container, '[data-slot="text-highlight"]')).animationName).toBe(
			'none'
		);
	});
	it('pauses the marquee timeline while its viewport is offscreen', async () => {
		// Isolate visibility from hover, keyboard-focus and user-controlled pauses.
		// A fixed box with explicit geometry also avoids relying on fixture layout.
		const { container } = await render(Marquee, {
			props: {
				pauseOnHover: false,
				controls: false,
				paused: false,
				style: 'position:fixed;left:0;top:0;width:240px;height:80px'
			}
		});
		const marquee = element(container, '[data-slot="marquee"]');
		const track = element(marquee, '.track');
		await expect.poll(() => getComputedStyle(track).animationPlayState).toBe('running');
		marquee.style.top = '-10000px';
		await expect.poll(() => getComputedStyle(track).animationPlayState).toBe('paused');
		marquee.style.top = '0px';
		await expect.poll(() => getComputedStyle(track).animationPlayState).toBe('running');
	});
	it('shares pointer coordinates across neighboring cards and clears them on exit', async () => {
		const { container } = await render(Fixture);
		const group = element(container, '[data-slot="spotlight-group"]');
		const first = element(container, '[data-testid="first"]');
		const second = element(container, '[data-testid="second"]');
		const rect = first.getBoundingClientRect();
		group.dispatchEvent(
			new PointerEvent('pointermove', {
				pointerType: 'mouse',
				clientX: rect.x + 40,
				clientY: rect.y + 50
			})
		);
		expect(first.style.getPropertyValue('--spot-x')).toBe('40px');
		expect(second.style.getPropertyValue('--spot-active')).toBe('1');
		expect(Number.parseFloat(second.style.getPropertyValue('--spot-x'))).toBeLessThan(0);
		group.dispatchEvent(new PointerEvent('pointerleave'));
		expect(first.style.getPropertyValue('--spot-active')).toBe('0');
		expect(second.style.getPropertyValue('--spot-active')).toBe('0');
	});
	it('pauses from the visible control and makes only the duplicate content inert', async () => {
		const { container } = await render(Fixture);
		const marquee = element(container, '[data-slot="marquee"]');
		const pause = element(marquee, 'button');
		expect(element(marquee, '.duplicate').inert).toBe(true);
		expect(element(marquee, '[data-marquee-set]').inert).toBe(false);
		pause.click();
		await tick();
		expect(marquee.dataset.paused).toBe('true');
		expect(pause.textContent).toContain('Resume scrolling');
	});
	it('settles pointer effects and looping animation when policy changes live', async () => {
		const { container } = await render(Fixture);
		const tilt = element(container, '[data-slot="tilt-card"]');
		const rect = tilt.getBoundingClientRect();
		element(tilt, '[data-astra-tilt]').dispatchEvent(
			new PointerEvent('pointermove', {
				pointerType: 'mouse',
				bubbles: true,
				clientX: rect.x + rect.width * 0.8,
				clientY: rect.y + rect.height * 0.2
			})
		);
		const surface = element(tilt, '[data-astra-tilt-content]');
		await expect.poll(() => surface.style.transform, { timeout: 3000 }).not.toBe('none');
		element(container, 'button').click();
		await tick();
		expect(surface.style.transform).toBe('none');
		expect(tilt.dataset.reduced).toBe('true');
		const marquee = element(container, '[data-slot="marquee"]');
		expect(marquee.dataset.reduced).toBe('true');
		expect(getComputedStyle(element(marquee, '.track')).animationName).toBe('none');
		expect(getComputedStyle(element(marquee, '.duplicate')).display).toBe('none');
	});
	it('settles tilt on focus and scroll while retaining native input state', async () => {
		const { container } = await render(Fixture);
		const card = element(container, '[data-slot="tilt-card"]');
		const host = element(card, '[data-astra-tilt]');
		const surface = element(card, '[data-astra-tilt-content]');
		const move = () => {
			const rect = host.getBoundingClientRect();
			host.dispatchEvent(
				new PointerEvent('pointermove', {
					pointerType: 'mouse',
					bubbles: true,
					clientX: rect.right - 2,
					clientY: rect.top + 2
				})
			);
		};
		move();
		await expect.poll(() => surface.style.transform, { timeout: 3000 }).not.toBe('none');
		const input = card.querySelector<HTMLInputElement>('input')!;
		input.value = 'kept';
		input.focus();
		await tick();
		expect(surface.style.transform).toBe('none');
		expect(document.activeElement).toBe(input);
		move();
		await tick();
		move();
		await expect.poll(() => surface.style.transform, { timeout: 3000 }).not.toBe('none');
		window.dispatchEvent(new Event('scroll'));
		await tick();
		expect(surface.style.transform).toBe('none');
		expect(card.querySelector('input')).toBe(input);
		expect(input.value).toBe('kept');
	});
	it('ignores touch pointer movement', async () => {
		const { container } = await render(Fixture);
		const group = element(container, '[data-slot="spotlight-group"]');
		group.dispatchEvent(
			new PointerEvent('pointermove', { pointerType: 'touch', clientX: 50, clientY: 50 })
		);
		expect(
			element(container, '[data-testid="first"]').style.getPropertyValue('--spot-active')
		).toBe('0');
	});
	it('keeps the original marquee content scrollable during keyboard focus', async () => {
		const { container } = await render(Fixture);
		const marquee = element(container, '[data-slot="marquee"]');
		element(marquee, 'a').focus();
		await tick();
		expect(getComputedStyle(element(marquee, '.viewport')).overflowX).toBe('auto');
		expect(getComputedStyle(element(marquee, '.duplicate')).display).toBe('none');
		expect(element(marquee, '[data-marquee-set]').querySelectorAll('a')).toHaveLength(4);
	});
	it('settles tilt at its configured target angle and resets a cancelled pointer', async () => {
		const { container } = await render(Fixture);
		const tilt = element(container, '[data-slot="tilt-card"]');
		const rect = tilt.getBoundingClientRect();
		element(tilt, '[data-astra-tilt]').dispatchEvent(
			new PointerEvent('pointermove', {
				pointerType: 'mouse',
				clientX: rect.right + 1000,
				clientY: rect.top - 1000
			})
		);
		const surface = element(tilt, '[data-astra-tilt-content]');
		await expect
			.poll(() => surface.style.transform, { timeout: 3000 })
			.toBe('rotateX(8deg) rotateY(8deg)');
		element(tilt, '[data-astra-tilt]').dispatchEvent(
			new PointerEvent('pointercancel', { pointerType: 'mouse' })
		);
		await expect.poll(() => surface.style.transform, { timeout: 3000 }).toBe('none');
	});
});
