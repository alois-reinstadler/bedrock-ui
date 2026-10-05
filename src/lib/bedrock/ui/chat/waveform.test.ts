import { describe, expect, it } from 'vitest';
import { expressiveLevel, microphoneLevel, smoothLevel, waveformPath } from './waveform';

describe('microphone visualization', () => {
	it('makes quiet speech expressive without amplifying silence or a DC offset', () => {
		const quiet = Float32Array.from(
			{ length: 1024 },
			(_, i) => 0.028 * Math.sin((i * Math.PI) / 16)
		);
		const rms = microphoneLevel(quiet);
		expect(rms).toBeCloseTo(0.0198, 3);
		expect(expressiveLevel(rms)).toBeGreaterThan(0.4);
		expect(expressiveLevel(0)).toBe(0);
		expect(expressiveLevel(0.002)).toBe(0);
		expect(microphoneLevel(new Float32Array(1024).fill(0.3))).toBeCloseTo(0);
		expect(microphoneLevel(new Float32Array())).toBe(0);
	});
	it('preserves dynamics and supports sensitivity with bounded output', () => {
		expect(expressiveLevel(0.01)).toBeLessThan(expressiveLevel(0.05));
		expect(expressiveLevel(0.02, 0.5)).toBeLessThan(expressiveLevel(0.02, 4));
		for (const level of [NaN, Infinity, -1, 0, 0.1, 1, 20]) {
			expect(expressiveLevel(level)).toBeGreaterThanOrEqual(0);
			expect(expressiveLevel(level)).toBeLessThanOrEqual(1);
		}
	});
	it('responds quickly and releases gently independent of frame rate', () => {
		expect(smoothLevel(0, 1, 65)).toBeGreaterThan(0.6);
		expect(smoothLevel(1, 0, 65)).toBeGreaterThan(0.7);
		let fine = 0;
		for (let i = 0; i < 10; i++) fine = smoothLevel(fine, 1, 10);
		expect(fine).toBeCloseTo(smoothLevel(0, 1, 100), 8);
		expect(smoothLevel(1, 0, 2000)).toBeLessThan(0.001);
	});
	it('keeps smooth curves inside the viewport with a motionless silent baseline', () => {
		expect(waveformPath(0, 0)).toBe(waveformPath(0, 99));
		for (let layer = 0; layer < 3; layer++) {
			const path = waveformPath(1, 4, layer);
			expect(path).toContain(' Q ');
			const numbers = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
			const ys = numbers.filter((_, index) => index % 2 === 1);
			expect(Math.min(...ys)).toBeGreaterThanOrEqual(8);
			expect(Math.max(...ys)).toBeLessThanOrEqual(88);
		}
	});
});
