import { motionEasings, resolveMotionDuration } from '#lib/bedrock/motion/index.js';

/** Keep the album frame still; only its changing content fades. */
export function albumMotion(_node: Element, options: { delay?: number; duration?: number } = {}) {
	const duration = resolveMotionDuration(options.duration ?? 240);
	return {
		duration,
		delay: duration ? (options.delay ?? 0) : 0,
		easing: motionEasings.enter,
		css: (t: number) => `opacity:${t}`
	};
}
