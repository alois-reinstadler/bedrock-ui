import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { motionPresets } from './tokens.js';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const normalBlock = css.slice(css.indexOf(':root'), css.indexOf('@media'));
const reducedBlock = css.slice(css.indexOf('@media'));

const durations = {
	'--motion-press': motionPresets.press.duration,
	'--motion-state': motionPresets.state.duration,
	'--motion-enter': motionPresets.enter.duration,
	'--motion-exit': motionPresets.exit.duration,
	'--motion-reveal': motionPresets.reveal.duration,
	'--motion-overlay': motionPresets.overlay.duration,
	'--motion-popover-enter': motionPresets.popover.enter,
	'--motion-popover-exit': motionPresets.popover.exit,
	'--motion-hint-enter': motionPresets.hint.enter,
	'--motion-hint-exit': motionPresets.hint.exit,
	'--motion-layout': motionPresets.layout.duration,
	'--motion-swap': motionPresets.swap.duration
} as const;

const easings = {
	'--motion-ease-enter': motionPresets.enter.easing,
	'--motion-ease-exit': motionPresets.exit.easing,
	'--motion-ease-move': motionPresets.move.easing,
	'--motion-ease-drawer': motionPresets.drawer.easing
} as const;

describe('motion token CSS parity', () => {
	it('matches every TypeScript duration', () => {
		for (const [property, duration] of Object.entries(durations)) {
			expect(normalBlock).toContain(`${property}: ${duration}ms;`);
		}
	});

	it('matches every cubic-bezier easing', () => {
		for (const [property, easing] of Object.entries(easings)) {
			expect(normalBlock).toContain(`${property}: cubic-bezier(${easing.join(', ')});`);
		}
	});

	it('makes every duration effectively instant for reduced motion', () => {
		for (const property of Object.keys(durations)) {
			expect(reducedBlock).toContain(`${property}: 0.01ms;`);
		}
	});
});
