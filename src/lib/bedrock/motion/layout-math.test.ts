import { describe, expect, it } from 'vitest';
import {
	boxesEqual,
	composeProjections,
	constrainInvert,
	hasScaleInvert,
	interpolateBox,
	invertProjection,
	invertTransform,
	isDegenerateBox,
	isSignificantInvert,
	localProjection,
	projectionBetween,
	projectionToInvert,
	springSamples,
	type Projection
} from './layout-math.js';

function expectProjectionClose(actual: Projection, expected: Projection) {
	expect(actual.tx).toBeCloseTo(expected.tx, 10);
	expect(actual.ty).toBeCloseTo(expected.ty, 10);
	expect(actual.sx).toBeCloseTo(expected.sx, 10);
	expect(actual.sy).toBeCloseTo(expected.sy, 10);
}

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

describe('nested projection math', () => {
	it('removes an inherited parent translation from the child local projection', () => {
		const parentTarget = { left: 100, top: 80, width: 200, height: 100 };
		const parentVisual = { left: 20, top: 20, width: 200, height: 100 };
		const childTarget = { left: 140, top: 100, width: 40, height: 20 };
		const childVisual = { left: 60, top: 40, width: 40, height: 20 };
		const parentWorld = projectionBetween(parentVisual, parentTarget);
		const childWorld = projectionBetween(childVisual, childTarget);

		expect(localProjection(childWorld, parentWorld)).toEqual({
			tx: 0,
			ty: 0,
			sx: 1,
			sy: 1
		});
	});

	it('removes inherited parent translation and scale from an unchanged child', () => {
		const parentTarget = { left: 100, top: 50, width: 200, height: 100 };
		const parentVisual = { left: 20, top: 10, width: 400, height: 200 };
		const childTarget = { left: 140, top: 70, width: 40, height: 20 };
		const childVisual = { left: 100, top: 50, width: 80, height: 40 };
		const parentWorld = projectionBetween(parentVisual, parentTarget);
		const childWorld = projectionBetween(childVisual, childTarget);

		expect(localProjection(childWorld, parentWorld)).toEqual({
			tx: 0,
			ty: 0,
			sx: 1,
			sy: 1
		});
	});

	it('retains only the child residual when the child also moves and resizes', () => {
		const parentTarget = { left: 100, top: 0, width: 200, height: 100 };
		const parentVisual = { left: 20, top: 0, width: 400, height: 100 };
		const childTarget = { left: 140, top: 20, width: 40, height: 20 };
		const childVisual = { left: 160, top: 10, width: 60, height: 30 };
		const parentWorld = projectionBetween(parentVisual, parentTarget);
		const childWorld = projectionBetween(childVisual, childTarget);
		const residual = localProjection(childWorld, parentWorld);

		expectProjectionClose(residual, { tx: 65, ty: -20, sx: 0.75, sy: 1.5 });
		expectProjectionClose(composeProjections(parentWorld, residual), childWorld);
		expectProjectionClose(invertProjection(invertProjection(residual)), residual);
		expect(projectionToInvert(residual, childTarget)).toEqual({
			dx: 30,
			dy: -10,
			sx: 0.75,
			sy: 1.5
		});
	});

	it('solves the exact midpoint instead of interpolating local endpoints', () => {
		const parentTarget = { left: 100, top: 0, width: 200, height: 100 };
		const parentFrom = { left: 20, top: 0, width: 400, height: 100 };
		const childTarget = { left: 140, top: 20, width: 40, height: 20 };
		const childFrom = { left: 160, top: 10, width: 60, height: 30 };
		const parentWorld = projectionBetween(
			interpolateBox(parentFrom, parentTarget, 0.5),
			parentTarget
		);
		const childWorld = projectionBetween(interpolateBox(childFrom, childTarget, 0.5), childTarget);
		const residual = localProjection(childWorld, parentWorld);

		expectProjectionClose(residual, {
			tx: 43.333333333333336,
			ty: -10,
			sx: 0.8333333333333333,
			sy: 1.25
		});
		expectProjectionClose(composeProjections(parentWorld, residual), childWorld);
		const cssResidual = projectionToInvert(residual, childTarget);
		expect(cssResidual.dx).toBeCloseTo(20, 10);
		expect(cssResidual.dy).toBeCloseTo(-5, 10);
	});

	it('composes three projection levels back to the desired child world transform', () => {
		const grandparentWorld = projectionBetween(
			{ left: 0, top: 20, width: 600, height: 300 },
			{ left: 100, top: 100, width: 300, height: 200 }
		);
		const parentWorld = projectionBetween(
			{ left: 90, top: 60, width: 240, height: 120 },
			{ left: 130, top: 130, width: 160, height: 100 }
		);
		const childWorld = projectionBetween(
			{ left: 150, top: 95, width: 54, height: 36 },
			{ left: 150, top: 150, width: 60, height: 30 }
		);
		const parentLocal = localProjection(parentWorld, grandparentWorld);
		const childLocal = localProjection(childWorld, parentWorld);

		expectProjectionClose(
			composeProjections(composeProjections(grandparentWorld, parentLocal), childLocal),
			childWorld
		);
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

describe('hasScaleInvert', () => {
	it('ignores pure translation', () => {
		expect(hasScaleInvert({ dx: 40, dy: -12, sx: 1, sy: 1 })).toBe(false);
	});
});

describe('springSamples', () => {
	it('starts at exactly 0 so nothing teleports before the first frame', () => {
		expect(springSamples()[0]).toBe(0);
	});

	it('settles at exactly 1', () => {
		const samples = springSamples();
		expect(samples[samples.length - 1]).toBe(1);
	});
});

describe('boxesEqual', () => {
	const box = { left: 10, top: 20, width: 100, height: 40 };

	it('tolerates sub-pixel jitter', () => {
		expect(boxesEqual(box, { ...box, left: 10.4 })).toBe(true);
	});

	it('detects a real move', () => {
		expect(boxesEqual(box, { ...box, top: 25 })).toBe(false);
	});
});
