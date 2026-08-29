import { describe, expect, it } from 'vitest';
import {
	captureBox,
	constrainInvert,
	cssInverseScale,
	cssInvert,
	hasScaleInvert,
	invertTransform,
	isDegenerateBox,
	isSignificantInvert,
	springLinearEasing
} from './layout-math.js';

describe('invertTransform', () => {
	it('moves right and down as negative translate (element must be pulled back to First)', () => {
		expect(
			invertTransform(
				{ left: 10, top: 20, width: 100, height: 40 },
				{ left: 40, top: 50, width: 100, height: 40 }
			)
		).toEqual({ dx: -30, dy: -30, sx: 1, sy: 1 });
	});

	it('scales from a larger First onto a smaller Last', () => {
		expect(
			invertTransform(
				{ left: 0, top: 0, width: 200, height: 100 },
				{ left: 0, top: 0, width: 100, height: 50 }
			)
		).toEqual({ dx: 0, dy: 0, sx: 2, sy: 2 });
	});
});

describe('constrainInvert', () => {
	const invert = { dx: 12, dy: -8, sx: 1.4, sy: 0.5 };

	it('keeps translate only for position', () => {
		expect(constrainInvert(invert, 'position')).toEqual({ dx: 12, dy: -8, sx: 1, sy: 1 });
	});

	it('keeps scale only for size', () => {
		expect(constrainInvert(invert, 'size')).toEqual({ dx: 0, dy: 0, sx: 1.4, sy: 0.5 });
	});
});

describe('isSignificantInvert', () => {
	it('ignores sub-pixel jitter', () => {
		expect(isSignificantInvert({ dx: 0.2, dy: -0.1, sx: 1, sy: 1 })).toBe(false);
	});

	it('detects a real move', () => {
		expect(isSignificantInvert({ dx: 18, dy: 0, sx: 1, sy: 1 })).toBe(true);
	});
});

describe('isDegenerateBox', () => {
	it('treats a detached-node rect as unusable', () => {
		expect(isDegenerateBox({ left: 0, top: 0, width: 0, height: 0 })).toBe(true);
	});

	it('keeps a real pill-sized box', () => {
		expect(isDegenerateBox({ left: 40, top: 12, width: 72, height: 32 })).toBe(false);
	});

	it('rejects a collapsed width even when height is real', () => {
		expect(isDegenerateBox({ left: 0, top: 12, width: 0, height: 32 })).toBe(true);
	});
});

describe('captureBox', () => {
	const fallback = { left: 10, top: 20, width: 80, height: 32 };

	it('keeps the last good box when the node is detached', () => {
		const el = {
			isConnected: false,
			getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 })
		} as HTMLElement;
		expect(captureBox(el, fallback)).toEqual(fallback);
	});

	it('keeps the last good box when the visual rect is empty', () => {
		const el = {
			isConnected: true,
			getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 })
		} as HTMLElement;
		expect(captureBox(el, fallback)).toEqual(fallback);
	});
});

describe('cssInvert', () => {
	it('emits a transform-only invert', () => {
		expect(cssInvert({ dx: 4, dy: -2, sx: 1, sy: 1 })).toBe('translate(4px, -2px) scale(1, 1)');
	});
});

describe('cssInverseScale', () => {
	it('undoes a non-uniform parent scale so type stays upright', () => {
		expect(cssInverseScale({ dx: 0, dy: 0, sx: 0.5, sy: 2 })).toBe('scale(2, 0.5)');
	});
});

describe('hasScaleInvert', () => {
	it('ignores pure translation', () => {
		expect(hasScaleInvert({ dx: 40, dy: -12, sx: 1, sy: 1 })).toBe(false);
	});
});

describe('springLinearEasing', () => {
	it('returns a CSS linear() easing with a terminal 1', () => {
		const easing = springLinearEasing();
		expect(easing.startsWith('linear(')).toBe(true);
		expect(easing.endsWith('1.0000)') || easing.includes('1.0000')).toBe(true);
	});
});
