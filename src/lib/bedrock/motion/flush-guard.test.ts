import { describe, expect, it } from 'vitest';
import {
	createFlushGuardState,
	recordAnimatedFlush,
	shouldSuppressAnimatedFlush
} from './flush-guard.js';

describe('animated flush guard', () => {
	it.each([1000 / 60, 1000 / 120, 1000 / 240])(
		'degrades a sustained frame-rate storm at %sms intervals',
		(interval) => {
			const state = createFlushGuardState();
			let warning = null;
			for (let index = 0; index < 30 && !warning; index += 1) {
				warning = recordAnimatedFlush(state, index * interval, 1, 'mutation');
			}
			expect(warning).not.toBeNull();
			expect(shouldSuppressAnimatedFlush(state, state.suppressedUntil - 1)).toBe(true);
		}
	);

	it('allows ordinary cheap updates spaced fifty milliseconds apart', () => {
		const state = createFlushGuardState();
		for (let index = 0; index < 8; index += 1) {
			expect(recordAnimatedFlush(state, index * 50, 1, 'registration')).toBeNull();
		}
		expect(shouldSuppressAnimatedFlush(state, 401)).toBe(false);
	});

	it('degrades three costly animation flushes', () => {
		const state = createFlushGuardState();
		expect(recordAnimatedFlush(state, 0, 17, 'mutation')).toBeNull();
		expect(recordAnimatedFlush(state, 50, 17, 'mutation')).toBeNull();
		const warning = recordAnimatedFlush(state, 100, 17, 'mutation');
		expect(warning?.cost).toBe(51);
		expect(warning?.reason).toBe('mutation');
	});

	it('does not combine dense bursts separated by a quiet interval', () => {
		const state = createFlushGuardState();
		for (const at of [0, 4, 8, 130, 134, 138]) {
			expect(recordAnimatedFlush(state, at, 1, 'mutation')).toBeNull();
		}
	});

	it('does not combine costly flushes separated by a quiet interval', () => {
		const state = createFlushGuardState();
		expect(recordAnimatedFlush(state, 0, 17, 'mutation')).toBeNull();
		expect(recordAnimatedFlush(state, 50, 17, 'mutation')).toBeNull();
		expect(recordAnimatedFlush(state, 200, 17, 'mutation')).toBeNull();
	});

	it('extends suppression on animate requests and cleanly re-enters after quiet', () => {
		const state = createFlushGuardState();
		for (let index = 0; index < 6; index += 1) {
			recordAnimatedFlush(state, index * 17, 1, 'transition');
		}
		expect(shouldSuppressAnimatedFlush(state, 100)).toBe(true);
		expect(state.suppressedUntil).toBe(220);
		expect(shouldSuppressAnimatedFlush(state, 219)).toBe(true);
		expect(state.suppressedUntil).toBe(339);
		expect(shouldSuppressAnimatedFlush(state, 340)).toBe(false);
		expect(state.samples).toEqual([]);
	});

	it('does not involve baseline-only work', () => {
		const state = createFlushGuardState();
		expect(shouldSuppressAnimatedFlush(state, 10_000)).toBe(false);
		expect(state.samples).toEqual([]);
	});
});
