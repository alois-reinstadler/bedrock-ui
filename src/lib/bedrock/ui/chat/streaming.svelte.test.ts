import { describe, expect, it } from 'vitest';
import { streamText } from './streaming.svelte.js';

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe('streamText', () => {
	it('returns the full target immediately in instant mode', () => {
		const stream = streamText(() => 'Hello streaming world', { speed: 'instant' });

		expect(stream.text).toBe('Hello streaming world');
		expect(stream.done).toBe(true);
	});

	it('reveals natural mode progressively until it catches the target', async () => {
		const target = Array.from({ length: 40 }, (_, index) => `word${index}`).join(' ');
		const stream = streamText(() => target);

		expect(stream.text.length).toBeLessThan(target.length);
		expect(stream.done).toBe(false);

		const deadline = performance.now() + 5_000;
		while (!stream.done && performance.now() < deadline) await nextFrame();

		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
	});

	it('keeps revealing when the target grows mid-stream', async () => {
		let target = 'first chunk of text';
		const stream = streamText(() => target, { speed: 'fast' });

		expect(stream.done).toBe(false);
		target += ' and a later chunk';

		const deadline = performance.now() + 5_000;
		while (!stream.done && performance.now() < deadline) await nextFrame();

		expect(stream.text).toBe('first chunk of text and a later chunk');
		expect(stream.done).toBe(true);
	});
});
