import { describe, expect, it } from 'vitest';
import { composerPosition } from './position.js';

describe('contextual feedback positioning', () => {
	it('opens below the target when there is room', () => {
		expect(
			composerPosition(
				{ x: 300, y: 100, width: 200, height: 50 },
				{ width: 300, height: 200 },
				{ width: 1440, height: 900 }
			)
		).toEqual({ x: 250, y: 162 });
	});
	it('flips above a target close to the bottom', () => {
		expect(
			composerPosition(
				{ x: 300, y: 750, width: 200, height: 50 },
				{ width: 300, height: 200 },
				{ width: 1440, height: 900 }
			)
		).toEqual({ x: 250, y: 538 });
	});
	it('clamps a narrow viewport and avoids the toolbar', () => {
		const point = composerPosition(
			{ x: 250, y: 700, width: 60, height: 70 },
			{ width: 296, height: 260 },
			{ width: 320, height: 844 },
			{ x: 20, y: 786, width: 280, height: 46 }
		);
		expect(point.x).toBe(12);
		expect(point.y).toBeGreaterThanOrEqual(12);
		expect(point.y + 260).toBeLessThan(786);
	});
	it('keeps a page note clear of a top toolbar', () => {
		const point = composerPosition(
			undefined,
			{ width: 300, height: 200 },
			{ width: 390, height: 600 },
			{ x: 85, y: 16, width: 280, height: 46 }
		);
		expect(point.x).toBeGreaterThanOrEqual(12);
		expect(point.x + 300).toBeLessThanOrEqual(378);
		expect(point.y).toBeGreaterThanOrEqual(74);
	});
});
