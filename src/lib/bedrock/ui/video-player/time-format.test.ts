import { describe, expect, it } from 'vitest';
import { clampTime, formatTime } from './time-format.js';

describe('formatTime', () => {
	it('formats minutes and seconds', () => {
		expect(formatTime(0)).toBe('0:00');
		expect(formatTime(5)).toBe('0:05');
		expect(formatTime(65)).toBe('1:05');
		expect(formatTime(599)).toBe('9:59');
	});

	it('formats hours with two-digit minutes', () => {
		expect(formatTime(3600)).toBe('1:00:00');
		expect(formatTime(3671)).toBe('1:01:11');
	});

	it('renders invalid input as zero', () => {
		expect(formatTime(Number.NaN)).toBe('0:00');
		expect(formatTime(-3)).toBe('0:00');
		expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
	});
});

describe('clampTime', () => {
	it('clamps into the playable range', () => {
		expect(clampTime(-4, 100)).toBe(0);
		expect(clampTime(140, 100)).toBe(100);
		expect(clampTime(42, 100)).toBe(42);
	});

	it('returns zero without a known duration', () => {
		expect(clampTime(10, Number.NaN)).toBe(0);
		expect(clampTime(10, 0)).toBe(0);
	});
});
