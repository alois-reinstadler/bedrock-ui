import { afterEach, describe, expect, it, vi } from 'vitest';
import { appear, drawer, reveal, vanish } from './presence.js';
import { prefersReducedMotion, resolveMotionDuration, type MotionEnvironment } from './policy.js';
import { clearCommittedLayoutOffset, commitLayoutOffset } from './layout-offset.js';

function environment(matches: boolean): MotionEnvironment {
	return { matchMedia: vi.fn(() => ({ matches })) };
}

function computedStyle(position = 'static') {
	return {
		opacity: '1',
		height: '40px',
		width: '160px',
		paddingTop: '8px',
		paddingBottom: '8px',
		paddingLeft: '12px',
		paddingRight: '12px',
		marginTop: '0px',
		marginBottom: '0px',
		borderTopWidth: '1px',
		borderBottomWidth: '1px',
		position
	} as CSSStyleDeclaration;
}

function element(): HTMLElement {
	return {
		offsetLeft: 12,
		offsetTop: 24,
		offsetWidth: 160,
		offsetHeight: 40,
		offsetParent: {} as Element,
		parentElement: null
	} as HTMLElement;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('motion preference policy', () => {
	it('is SSR-safe when matchMedia is unavailable', () => {
		expect(prefersReducedMotion(undefined)).toBe(false);
		expect(resolveMotionDuration(310, undefined)).toBe(310);
	});

	it('preserves the requested duration for full motion', () => {
		expect(resolveMotionDuration(230, environment(false))).toBe(230);
	});

	it('resolves every duration to zero for reduced motion', () => {
		expect(prefersReducedMotion(environment(true))).toBe(true);
		expect(resolveMotionDuration(500, environment(true))).toBe(0);
	});

	it('fails open when a preference source is unavailable', () => {
		const source: MotionEnvironment = {
			matchMedia: () => {
				throw new Error('unavailable');
			}
		};
		expect(prefersReducedMotion(source)).toBe(false);
		expect(resolveMotionDuration(175, source)).toBe(175);
	});
});

describe('presence policy integration', () => {
	it('settles every presence primitive immediately and removes delays', () => {
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({ matches: true }))
		);
		vi.stubGlobal('getComputedStyle', vi.fn(computedStyle));
		const node = element();
		const transitions = [
			reveal(node, { duration: 310, delay: 90 }),
			appear(node, { duration: 230, delay: 90 }),
			vanish(node, { duration: 175, delay: 90 }),
			drawer(node, { duration: 410, delay: 90 })
		];

		for (const transition of transitions) {
			expect(transition.duration).toBe(0);
			expect(transition.delay).toBe(0);
		}
	});

	it('uses clip-path rather than scale for appear and vanish', () => {
		vi.stubGlobal('getComputedStyle', vi.fn(computedStyle));
		const node = element();
		const appearCss = appear(node, { start: 0.9 }).css;
		const vanishCss = vanish(node, { end: 0.85 }).css;

		expect(appearCss).toBeTypeOf('function');
		expect(vanishCss).toBeTypeOf('function');
		const appearFrame = appearCss!(0.5, 0.5);
		const vanishFrame = vanishCss!(0.5, 0.5);
		expect(appearFrame).toContain('clip-path: inset(2.5000%)');
		expect(vanishFrame).toContain('clip-path: inset(3.7500%)');
		expect(appearFrame).not.toContain('scale:');
		expect(vanishFrame).not.toContain('scale:');
		expect(vanishFrame).toContain('box-sizing: border-box');
	});

	it('pins a layout exit from its last committed pre-reconciliation geometry', () => {
		vi.stubGlobal('getComputedStyle', vi.fn(computedStyle));
		const node = element();
		commitLayoutOffset(node);
		Object.assign(node, { offsetLeft: 80, offsetTop: 96 });

		const css = vanish(node).css;
		expect(css).toBeTypeOf('function');
		expect(css!(1, 0)).toContain('left: 12px;top: 24px;');
		clearCommittedLayoutOffset(node);
	});

	it('gates drawer opacity until its real shell can contain fixed-width content', () => {
		vi.stubGlobal('getComputedStyle', vi.fn(computedStyle));
		const css = drawer(element(), { duration: 410, easing: (t) => t }).css;

		expect(css).toBeTypeOf('function');
		expect(css!(0.5, 0.5)).toContain('opacity: 0;');
		expect(css!(0.5, 0.5)).toContain('width: 80px;');
		const midpointOpacity = Number(css!(0.775, 0.225).match(/opacity: ([^;]+);/)?.[1]);
		expect(midpointOpacity).toBeCloseTo(0.5);
		expect(css!(1, 0)).toContain('opacity: 1;');
	});

	it('warns when vanish cannot preserve a stable local containing block', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		vi.stubGlobal(
			'getComputedStyle',
			vi.fn(() => computedStyle('sticky'))
		);
		const node = element();
		vanish(node);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('stable local containing block'),
			node
		);
	});
});
