import { onDestroy } from 'svelte';
import type { MotionValue } from 'astra-motion/values';
import { useMotionPolicy } from './policy.svelte.js';

/** Complete only a component-owned value at its intended target, including paint.
 * Call during component setup; the caller retains responsibility for destroying
 * the value. This adapter deliberately has no runtime Astra dependency. */
export function settleOnReducedMotion<T>(value: MotionValue<T>): void {
	const policy = useMotionPolicy();
	const settle = () => {
		if (!policy.reduced) return;
		const animation = value.animation;
		if (animation && 'complete' in animation && typeof animation.complete === 'function') {
			animation.complete();
		}
	};
	// Astra can schedule an exit after a policy effect has already run. The public
	// animationStart event fires after the value's playback control is assigned.
	onDestroy(value.on('animationStart', settle));
	$effect(settle);
}
