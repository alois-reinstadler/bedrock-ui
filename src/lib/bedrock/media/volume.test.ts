import { describe, expect, it } from 'vitest';
import { gainToVolume, volumeToGain } from './volume.js';

describe('perceptual volume taper', () => {
	it('provides silence, full volume, and equal decibel steps', () => {
		expect(volumeToGain(0)).toBe(0);
		expect(volumeToGain(1)).toBe(1);
		expect(volumeToGain(0.5)).toBeCloseTo(0.1);
		expect(volumeToGain(0.75) / volumeToGain(0.5)).toBeCloseTo(
			volumeToGain(0.5) / volumeToGain(0.25)
		);
	});
	it('round-trips control levels and handles invalid values', () => {
		for (const level of [0, 0.01, 0.2, 0.5, 0.8, 1]) {
			expect(gainToVolume(volumeToGain(level))).toBeCloseTo(level);
		}
		expect(volumeToGain(-1)).toBe(0);
		expect(volumeToGain(10)).toBe(1);
		expect(volumeToGain(NaN)).toBe(0);
		expect(gainToVolume(Infinity)).toBe(0);
	});
});
