import { describe, expect, it } from 'vitest';
import { cubicBezier, motionPresets } from './tokens.js';

describe('Astryx motion presets', () => {
	it('keeps semantic durations distinct', () => {
		expect(motionPresets.press.duration).toBe(130);
		expect(motionPresets.state.duration).toBe(175);
		expect(motionPresets.enter.duration).toBe(230);
		expect(motionPresets.exit.duration).toBe(175);
		expect(motionPresets.reveal.duration).toBe(310);
		expect(motionPresets.overlay.duration).toBe(410);
		expect(motionPresets.popover).toEqual({ enter: 200, exit: 150 });
		expect(motionPresets.hint).toEqual({ enter: 140, exit: 100 });
	});

	it('pins layout and swap spring physics', () => {
		expect(motionPresets.layout).toEqual({
			duration: 500,
			spring: { stiffness: 117, damping: 18.4, mass: 1 }
		});
		expect(motionPresets.swap).toEqual({
			duration: 400,
			spring: { stiffness: 183, damping: 23, mass: 1 }
		});
	});
});

describe('cubicBezier', () => {
	it('preserves the timing endpoints', () => {
		const easing = cubicBezier(0.23, 1, 0.32, 1);
		expect(easing(0)).toBe(0);
		expect(easing(1)).toBe(1);
	});

	it('produces the fast Astryx entry curve', () => {
		const easing = cubicBezier(0.23, 1, 0.32, 1);
		expect(easing(0.5)).toBeGreaterThan(0.85);
	});
});

describe('CSS token parity', () => {
	it('checks every CSS value and prevents extra untracked root tokens', async () => {
		const { readFile } = await import('node:fs/promises');
		const { motionCssTokens } = await import('./tokens.js');
		const css = await readFile(new URL('./tokens.css', import.meta.url), 'utf8');
		const root = css.match(/:root\s*\{([^}]+)\}/)![1];
		const declarations = Object.fromEntries(
			[...root.matchAll(/(--motion-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]])
		);
		expect(declarations).toEqual(motionCssTokens);
	});

	it('converts milliseconds at the Astra boundary only', async () => {
		const { astraPresets } = await import('./astra-presets.js');
		expect(astraPresets.feedback.duration).toBe(0.13);
		expect(astraPresets.disclosure.duration).toBe(0.31);
		expect(astraPresets.relocation).toEqual({ type: 'spring', ...motionPresets.layout.spring });
	});
});
