import type { TransitionConfig } from 'svelte/transition';
import { motionEasings, motionPresets } from '#lib/bedrock/motion/tokens.js';
import { elementPrefersReducedMotion } from '#lib/bedrock/motion/policy.js';
import { withLiveReduction } from '#lib/bedrock/motion/presence.js';

/** Keep the album frame still; Astryx enter/exit applies only to changing content.
 * Delays are composition choreography, independent of the shared playback speed. */
export function albumMotion(
	node: Element,
	options: { delay?: number; duration?: number } = {},
	{ direction = 'in' }: { direction?: 'in' | 'out' | 'both' } = {}
): TransitionConfig {
	const exiting = direction === 'out';
	const duration = elementPrefersReducedMotion(node)
		? 0
		: (options.duration ?? (exiting ? motionPresets.exit.duration : motionPresets.enter.duration));
	return withLiveReduction(node, {
		duration,
		delay: duration ? (options.delay ?? 0) : 0,
		easing: exiting ? motionEasings.exit : motionEasings.enter,
		css: (t: number) => `opacity:${t}`
	});
}
