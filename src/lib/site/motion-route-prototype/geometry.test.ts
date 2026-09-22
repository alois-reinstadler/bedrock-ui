import { describe, expect, it } from 'vitest';
import { coverBox, trajectory, intersect } from './geometry.js';

describe('shared image crop geometry', () => {
	it('covers a square without stretching a widescreen image', () => {
		const result = coverBox({ x: 0, y: 0, width: 300, height: 300 }, 1600, 900);
		expect(result.height).toBe(300);
		expect(result.width / result.height).toBeCloseTo(16 / 9);
		expect(result.x * 2 + result.width).toBeCloseTo(300);
	});
	it('preserves a focal point when the destination aspect ratio changes', () => {
		const result = coverBox({ x: 0, y: 0, width: 900, height: 300 }, 1600, 900, 0.5, 0.25);
		expect(result.width).toBe(900);
		expect(result.y).toBe((300 - result.height) * 0.25);
		expect(result.width / result.height).toBeCloseTo(16 / 9);
	});
});

describe('route retargeting', () => {
	it('carries both position and velocity through an interrupted reversal', () => {
		const running = trajectory(0, 800, 0, 360, 180);
		const reversed = trajectory(running.position, 0, running.velocity, 240, 0);
		expect(reversed).toEqual(running);
		expect(trajectory(running.position, 0, running.velocity, 240, 240)).toEqual({
			position: 0,
			velocity: 0
		});
	});
	it('approaches the same velocity from either side of a retarget', () => {
		const at = trajectory(20, 600, 0, 360, 90);
		const before = trajectory(20, 600, 0, 360, 89.999);
		const after = trajectory(at.position, 140, at.velocity, 360, 0.001);
		expect((at.position - before.position) / 0.001).toBeCloseTo(
			(after.position - at.position) / 0.001,
			3
		);
	});
	it('intersects nested clip bounds without allowing a negative visible area', () => {
		expect(
			intersect({ x: 0, y: 0, width: 200, height: 100 }, { x: 150, y: 50, width: 100, height: 100 })
		).toEqual({ x: 150, y: 50, width: 50, height: 50 });
		expect(
			intersect(
				{ x: 0, y: 0, width: 100, height: 100 },
				{ x: 200, y: 200, width: 100, height: 100 }
			).width
		).toBe(0);
	});
});
