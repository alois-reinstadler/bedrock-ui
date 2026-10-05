import { describe, expect, it } from 'vitest';
import { streamText } from './streaming.svelte.js';

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe('streamText', () => {
	it('shows incoming text immediately by default', () => {
		let target = 'First chunk';
		const stream = streamText(() => target);
		expect(stream.text).toBe(target);
		target += ' and the next chunk';
		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
		stream.dispose();
	});

	it('settles an explicitly paced stream when application reduction changes', async () => {
		let reduced = false;
		const target = 'Long '.repeat(100);
		const stream = streamText(() => target, { speed: 'natural', reduced: () => reduced });
		expect(stream.text.length).toBeLessThan(target.length);
		reduced = true;
		await nextFrame();
		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
		stream.dispose();
	});

	it('never hides text already exposed by a reduced-motion getter', () => {
		let reduced = false;
		let target = 'Long '.repeat(100);
		const stream = streamText(() => target, { speed: 'natural', reduced: () => reduced });
		expect(stream.text.length).toBeLessThan(target.length);
		reduced = true;
		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
		reduced = false;
		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
		const settled = target;
		target += ' New chunk';
		expect(stream.text).toBe(settled);
		stream.dispose();
	});

	it('disposes queued pacing and exposes the latest text', async () => {
		const target = 'Long '.repeat(100);
		const stream = streamText(() => target, { speed: 'natural' });
		expect(stream.done).toBe(false);
		stream.dispose();
		await nextFrame();
		expect(stream.text).toBe(target);
		expect(stream.done).toBe(true);
	});
	it('returns the full target immediately in instant mode', () => {
		const stream = streamText(() => 'Hello streaming world', { speed: 'instant' });

		expect(stream.text).toBe('Hello streaming world');
		expect(stream.done).toBe(true);
	});

	it('reveals natural mode progressively until it catches the target', async () => {
		const target = Array.from({ length: 40 }, (_, index) => `word${index}`).join(' ');
		const stream = streamText(() => target, { speed: 'natural' });

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
