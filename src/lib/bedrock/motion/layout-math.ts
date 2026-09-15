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

/** An axis-aligned affine transform in group-root coordinates.
 * Applying it to a point uses `x * sx + tx` and `y * sy + ty`. */
export type Projection = {
	tx: number;
	ty: number;
	sx: number;
	sy: number;
};

export type LayoutType = 'both' | 'position' | 'size';

export type SpringOptions = {
	stiffness?: number;
	damping?: number;
	mass?: number;
};

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

export function invertTransform(from: LayoutBox, to: LayoutBox): Invert {
	return {
		dx: from.left - to.left,
		dy: from.top - to.top,
		sx: to.width === 0 ? 1 : from.width / to.width,
		sy: to.height === 0 ? 1 : from.height / to.height
	};
}

/** Maps `target` onto `visual` in group-root coordinates. */
export function projectionBetween(visual: LayoutBox, target: LayoutBox): Projection {
	const sx = target.width === 0 ? 1 : visual.width / target.width;
	const sy = target.height === 0 ? 1 : visual.height / target.height;
	return {
		tx: visual.left - sx * target.left,
		ty: visual.top - sy * target.top,
		sx,
		sy
	};
}

/** Compose transforms in visual order: the returned projection applies `inner`, then `outer`. */
export function composeProjections(outer: Projection, inner: Projection): Projection {
	return {
		tx: outer.sx * inner.tx + outer.tx,
		ty: outer.sy * inner.ty + outer.ty,
		sx: outer.sx * inner.sx,
		sy: outer.sy * inner.sy
	};
}

export function invertProjection(projection: Projection): Projection {
	if (projection.sx === 0 || projection.sy === 0) {
		throw new RangeError('Cannot invert a projection with a zero scale');
	}
	return {
		tx: -projection.tx / projection.sx,
		ty: -projection.ty / projection.sy,
		sx: 1 / projection.sx,
		sy: 1 / projection.sy
	};
}

/** The transform a child must apply locally so its composed world transform is `desiredWorld`. */
export function localProjection(desiredWorld: Projection, ancestorWorld: Projection): Projection {
	return composeProjections(invertProjection(ancestorWorld), desiredWorld);
}

/** Convert a root-coordinate projection to the existing top-left-origin CSS FLIP representation. */
export function projectionToInvert(projection: Projection, target: LayoutBox): Invert {
	return {
		dx: projection.tx + (projection.sx - 1) * target.left,
		dy: projection.ty + (projection.sy - 1) * target.top,
		sx: projection.sx,
		sy: projection.sy
	};
}

/** Interpolate visual geometry. Progress is intentionally not clamped so spring overshoot is preserved. */
export function interpolateBox(from: LayoutBox, to: LayoutBox, progress: number): LayoutBox {
	return {
		left: from.left + (to.left - from.left) * progress,
		top: from.top + (to.top - from.top) * progress,
		width: from.width + (to.width - from.width) * progress,
		height: from.height + (to.height - from.height) * progress
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

export function hasScaleInvert(invert: Invert): boolean {
	return Math.abs(1 - invert.sx) > SCALE_EPSILON || Math.abs(1 - invert.sy) > SCALE_EPSILON;
}

/** Progress samples 0 → 1 at 60Hz steps. The leading 0 is load-bearing: the first
 * value is the easing output at time 0, so omitting it makes every animation
 * teleport the first sample's worth of distance before the first frame. */
export function springSamples(options: SpringOptions = {}): number[] {
	const stiffness = options.stiffness ?? 117;
	const damping = options.damping ?? 18.4;
	const mass = options.mass ?? 1;
	const dt = 1 / 60;
	const samples: number[] = [0];
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

	if (samples[samples.length - 1] !== 1) {
		samples.push(1);
	}

	return samples;
}

export function boxesEqual(a: LayoutBox, b: LayoutBox, epsilon = 0.5): boolean {
	return (
		Math.abs(a.left - b.left) <= epsilon &&
		Math.abs(a.top - b.top) <= epsilon &&
		Math.abs(a.width - b.width) <= epsilon &&
		Math.abs(a.height - b.height) <= epsilon
	);
}
