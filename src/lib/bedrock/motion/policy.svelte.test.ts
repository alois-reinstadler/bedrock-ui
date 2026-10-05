import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './policy-fixtures/Browser.svelte';

/** A live OS preference source in the real browser; no global Chrome emulation. */
function mockPreference() {
	let matches = false;
	const listeners = new Set<EventListenerOrEventListenerObject>();
	const query = {
		get matches() {
			return matches;
		},
		media: '(prefers-reduced-motion: reduce)',
		addEventListener: (_: string, callback: EventListenerOrEventListenerObject) =>
			listeners.add(callback),
		removeEventListener: (_: string, callback: EventListenerOrEventListenerObject) =>
			listeners.delete(callback)
	};
	vi.stubGlobal('matchMedia', () => query);
	return (reduced: boolean) => {
		matches = reduced;
		const event = new MediaQueryListEvent('change', { matches, media: query.media });
		for (const listener of listeners) {
			if (typeof listener === 'function') listener(event);
			else listener.handleEvent(event);
		}
	};
}

let setOsReduced: (reduced: boolean) => void;
beforeEach(() => {
	setOsReduced = mockPreference();
});
afterEach(async () => {
	await cleanup();
	vi.unstubAllGlobals();
});

function node(id: string): HTMLElement {
	const element = document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
	if (!element) throw new Error(`Missing policy fixture: ${id}`);
	return element;
}

function translateX(element: Element): number {
	const transform = getComputedStyle(element).transform;
	return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
}

function isRunning(element: Element): boolean {
	return element
		.getAnimations({ subtree: true })
		.some((animation) => animation.playState === 'running');
}

describe('Bedrock scoped motion in the shared browser', () => {
	it('cannot re-enable movement beneath an app-reduced ancestor', async () => {
		const view = await render(Fixture);
		expect(node('policy-inner').dataset.policy).toBe('full');
		await view.getByRole('button', { name: 'Toggle application reduction' }).click();
		await expect.poll(() => node('policy-inner').dataset.policy).toBe('reduced');
		expect(Number.parseFloat(getComputedStyle(node('policy-css')).transitionDuration)).toBeLessThan(
			0.001
		);
		await view.getByRole('button', { name: 'Start movement' }).click();
		await expect.poll(() => translateX(node('policy-astra'))).toBeCloseTo(100, 1);
		expect(getComputedStyle(node('policy-astra')).opacity).toBe('0.35');
		await expect.poll(() => isRunning(node('policy-inner'))).toBe(false);
	});

	it('carries live app policy to a portal outside the provider DOM', async () => {
		const view = await render(Fixture);
		const portal = node('policy-portal');
		expect(portal.parentElement).toBe(document.body);
		expect(portal.dataset.bedrockMotion).toBe('full');
		await view.getByRole('button', { name: 'Toggle application reduction' }).click();
		await expect.poll(() => portal.dataset.bedrockMotion).toBe('reduced');
		expect(Number.parseFloat(getComputedStyle(portal).transitionDuration)).toBeLessThan(0.001);
		await view.getByRole('button', { name: 'Toggle application reduction' }).click();
		await expect.poll(() => portal.dataset.bedrockMotion).toBe('full');
		expect(Number.parseFloat(getComputedStyle(portal).transitionDuration)).toBeCloseTo(0.31);
		await cleanup();
		expect(document.querySelector('[data-testid="policy-portal"]')).toBeNull();
	});

	it('settles active reveal, retained Swap exits, and Astra position/opacity on live reduction', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'Start movement' }).click();
		await expect.poll(() => isRunning(node('policy-reveal'))).toBe(true);
		await expect
			.poll(() => Number.parseFloat(getComputedStyle(node('policy-astra')).opacity))
			.toBeLessThan(0.99);
		expect(node('policy-swap').textContent).toContain('Previous content');
		await view.getByRole('button', { name: 'Toggle application reduction' }).click();
		await expect.poll(() => isRunning(node('policy-reveal')), { timeout: 700 }).toBe(false);
		await expect
			.poll(() => node('policy-swap').textContent, { timeout: 700 })
			.not.toContain('Previous content');
		await expect.poll(() => translateX(node('policy-astra')), { timeout: 700 }).toBeCloseTo(100, 1);
		await expect
			.poll(() => getComputedStyle(node('policy-astra')).opacity, { timeout: 700 })
			.toBe('0.35');
		expect(node('policy-reveal').getBoundingClientRect().height).toBeCloseTo(40);
		expect(node('policy-reveal').style.overflow).toBe('');
	});

	it('observes live OS reduction without a Bedrock provider', async () => {
		const view = await render(Fixture, { providerFree: true });
		await view.getByRole('button', { name: 'Start movement' }).click();
		await expect.poll(() => isRunning(node('policy-reveal'))).toBe(true);
		setOsReduced(true);
		await expect.poll(() => node('policy-inner').dataset.policy).toBe('reduced');
		await expect.poll(() => isRunning(node('policy-reveal')), { timeout: 700 }).toBe(false);
		await expect.poll(() => translateX(node('policy-astra')), { timeout: 700 }).toBeCloseTo(100, 1);
		await expect
			.poll(() => getComputedStyle(node('policy-astra')).opacity, { timeout: 700 })
			.toBe('0.35');
		expect(node('policy-portal').dataset.bedrockMotion).toBe('reduced');
	});
});
