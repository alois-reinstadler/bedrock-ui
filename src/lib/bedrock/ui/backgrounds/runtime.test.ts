import { describe, expect, it } from 'vitest';
import { backgroundColors, bounded } from './runtime.js';

describe('shader input contract', () => {
	it('keeps valid hex alpha colors and rejects unsupported CSS expressions', () => {
		expect(
			backgroundColors(['var(--primary)', '#abc', 'oklch(0.7 0.2 30)', '#12345678'], 'gradient')
		).toEqual(['#abc', '#12345678']);
		expect(backgroundColors([], 'rays').length).toBeGreaterThan(0);
	});
	it('respects the two shader color-array limits', () => {
		const colors = Array.from({ length: 20 }, () => '#ffffff');
		expect(backgroundColors(colors, 'gradient')).toHaveLength(10);
		expect(backgroundColors(colors, 'rays')).toHaveLength(5);
	});
	it('bounds rendering cost and handles invalid numeric configuration', () => {
		expect(bounded(Infinity, 10000, 4000000, 1000000)).toBe(1000000);
		expect(bounded(9000000, 10000, 4000000, 1000000)).toBe(4000000);
		expect(bounded(-1, 0, 1, 0.5)).toBe(0);
	});
});
