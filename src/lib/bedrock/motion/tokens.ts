export type MotionSpring = {
	stiffness: number;
	damping: number;
	mass: number;
};

export type LayoutMotion = {
	duration: number;
	spring: MotionSpring;
};

/** Bedrock's Astryx-aligned semantic motion vocabulary. Durations are in ms. */
export const motionPresets = {
	press: { duration: 130 },
	state: { duration: 175 },
	enter: { duration: 230, easing: [0.23, 1, 0.32, 1] },
	exit: { duration: 175, easing: [0.3, 0, 0.6, 0.6] },
	reveal: { duration: 310 },
	overlay: { duration: 410 },
	popover: { enter: 200, exit: 150 },
	hint: { enter: 140, exit: 100 },
	move: { easing: [0.77, 0, 0.175, 1] },
	drawer: { easing: [0.32, 0.72, 0, 1] },
	layout: {
		duration: 500,
		spring: { stiffness: 117, damping: 18.4, mass: 1 }
	},
	swap: {
		duration: 400,
		spring: { stiffness: 183, damping: 23, mass: 1 }
	}
} as const;

export type EasingFunction = (t: number) => number;

/** Convert a CSS cubic-bezier timing curve into a Svelte easing function. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
	const sample = (a: number, b: number, t: number) => {
		const inverse = 1 - t;
		return 3 * inverse * inverse * t * a + 3 * inverse * t * t * b + t * t * t;
	};

	return (time) => {
		if (time <= 0 || time >= 1) return time;
		let low = 0;
		let high = 1;
		let parameter = time;
		for (let i = 0; i < 12; i += 1) {
			parameter = (low + high) / 2;
			const x = sample(x1, x2, parameter);
			if (x < time) low = parameter;
			else high = parameter;
		}
		return sample(y1, y2, parameter);
	};
}

const enter = cubicBezier(...motionPresets.enter.easing);
const exit = cubicBezier(...motionPresets.exit.easing);
const move = cubicBezier(...motionPresets.move.easing);
const drawer = cubicBezier(...motionPresets.drawer.easing);

/** Svelte passes outro progress from 1 to 0; reflect a CSS timing curve so the
 * perceived time curve remains identical to `cubic-bezier(...)` in CSS. */
function forOutro(easing: EasingFunction): EasingFunction {
	return (t) => 1 - easing(1 - t);
}

export const motionEasings = {
	enter,
	exit: forOutro(exit),
	move,
	drawer
} as const;

/** Named behaviors shared by CSS, retained helpers and Astra compositions. Milliseconds. */
export const motionRecipes = {
	feedback: motionPresets.press,
	disclosure: { duration: motionPresets.reveal.duration, easing: motionPresets.enter.easing },
	relocation: motionPresets.layout,
	contentReplacement: motionPresets.swap,
	/** Readable label tween; separate from the physics-based replacement recipe. */
	labelReplacement: { duration: motionPresets.swap.duration, easing: motionPresets.enter.easing },
	gestureSettlement: motionPresets.layout
} as const;

/** Canonical CSS representation; checked against tokens.css by the token suite. */
export const motionCssTokens = {
	'--motion-press': `${motionPresets.press.duration}ms`,
	'--motion-state': `${motionPresets.state.duration}ms`,
	'--motion-enter': `${motionPresets.enter.duration}ms`,
	'--motion-exit': `${motionPresets.exit.duration}ms`,
	'--motion-reveal': `${motionPresets.reveal.duration}ms`,
	'--motion-overlay': `${motionPresets.overlay.duration}ms`,
	'--motion-popover-enter': `${motionPresets.popover.enter}ms`,
	'--motion-popover-exit': `${motionPresets.popover.exit}ms`,
	'--motion-hint-enter': `${motionPresets.hint.enter}ms`,
	'--motion-hint-exit': `${motionPresets.hint.exit}ms`,
	'--motion-layout': `${motionPresets.layout.duration}ms`,
	'--motion-swap': `${motionPresets.swap.duration}ms`,
	'--motion-ease-enter': `cubic-bezier(${motionPresets.enter.easing.join(', ')})`,
	'--motion-ease-exit': `cubic-bezier(${motionPresets.exit.easing.join(', ')})`,
	'--motion-ease-move': `cubic-bezier(${motionPresets.move.easing.join(', ')})`,
	'--motion-ease-drawer': `cubic-bezier(${motionPresets.drawer.easing.join(', ')})`
} as const;
