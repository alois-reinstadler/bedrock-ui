export type LayoutBox = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export type Invert = {
	dx: number;
	dy: number;
	sx: number;
	sy: number;
};

export type LayoutType = 'both' | 'position' | 'size';

const POSITION_EPSILON = 0.5;
const SCALE_EPSILON = 0.001;

export function boxFromRect(rect: DOMRectReadOnly): LayoutBox {
	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height
	};
}

/** Detached nodes report an empty rect; using it as First sends the element to the viewport origin. */
export function isDegenerateBox(box: LayoutBox): boolean {
	return box.width < 0.5 || box.height < 0.5;
}

export function captureBox(el: HTMLElement, fallback: LayoutBox): LayoutBox {
	if (!el.isConnected) return fallback;
	const box = boxFromRect(el.getBoundingClientRect());
	return isDegenerateBox(box) ? fallback : box;
}

export function invertTransform(from: LayoutBox, to: LayoutBox): Invert {
	return {
		dx: from.left - to.left,
		dy: from.top - to.top,
		sx: to.width === 0 ? 1 : from.width / to.width,
		sy: to.height === 0 ? 1 : from.height / to.height
	};
}

export function constrainInvert(invert: Invert, type: LayoutType = 'both'): Invert {
	if (type === 'position') {
		return { ...invert, sx: 1, sy: 1 };
	}
	if (type === 'size') {
		return { ...invert, dx: 0, dy: 0 };
	}
	return invert;
}

export function isSignificantInvert(invert: Invert): boolean {
	return (
		Math.abs(invert.dx) > POSITION_EPSILON ||
		Math.abs(invert.dy) > POSITION_EPSILON ||
		Math.abs(1 - invert.sx) > SCALE_EPSILON ||
		Math.abs(1 - invert.sy) > SCALE_EPSILON
	);
}

export function cssInvert(invert: Invert): string {
	return `translate(${invert.dx}px, ${invert.dy}px) scale(${invert.sx}, ${invert.sy})`;
}

export function cssInverseScale(invert: Invert): string {
	const sx = invert.sx === 0 ? 1 : 1 / invert.sx;
	const sy = invert.sy === 0 ? 1 : 1 / invert.sy;
	return `scale(${sx}, ${sy})`;
}

export function hasScaleInvert(invert: Invert): boolean {
	return Math.abs(1 - invert.sx) > SCALE_EPSILON || Math.abs(1 - invert.sy) > SCALE_EPSILON;
}

export function prefersReducedMotion(): boolean {
	return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function springLinearEasing(
	options: { stiffness?: number; damping?: number; mass?: number } = {}
): string {
	const stiffness = options.stiffness ?? 380;
	const damping = options.damping ?? 34;
	const mass = options.mass ?? 1;
	const dt = 1 / 60;
	const samples: number[] = [];
	let x = 0;
	let v = 0;
	const target = 1;

	for (let i = 0; i < 180; i++) {
		const force = -stiffness * (x - target) - damping * v;
		const a = force / mass;
		v += a * dt;
		x += v * dt;
		samples.push(x);
		if (Math.abs(x - target) < 0.001 && Math.abs(v) < 0.001) {
			break;
		}
	}

	if (samples.length === 0 || samples[samples.length - 1] !== 1) {
		samples.push(1);
	}

	return `linear(${samples.map((value) => value.toFixed(4)).join(', ')})`;
}

export function layoutEasing(options: { scale?: boolean } = {}): string {
	if (options.scale) {
		return 'cubic-bezier(0.22, 1, 0.36, 1)';
	}
	const spring = springLinearEasing();
	if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timing-function', spring)) {
		return spring;
	}
	return 'cubic-bezier(0.22, 1, 0.36, 1)';
}
