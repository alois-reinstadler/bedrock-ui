export type Box = { x: number; y: number; width: number; height: number };

/** Cubic Hermite path: position and velocity survive a retarget, end at rest.
 * Coordinates use CSS px, velocity uses px/ms. Sample only when building WAAPI tracks. */
export function trajectory(
	from: number,
	to: number,
	velocity: number,
	duration: number,
	time: number
) {
	const t = Math.max(0, Math.min(1, time / duration));
	const position =
		(2 * t ** 3 - 3 * t ** 2 + 1) * from +
		(t ** 3 - 2 * t ** 2 + t) * velocity * duration +
		(-2 * t ** 3 + 3 * t ** 2) * to;
	const speed =
		((6 * t ** 2 - 6 * t) * from +
			(3 * t ** 2 - 4 * t + 1) * velocity * duration +
			(-6 * t ** 2 + 6 * t) * to) /
		duration;
	return { position, velocity: speed };
}

export function intersect(a: Box, b: Box): Box {
	const x = Math.max(a.x, b.x);
	const y = Math.max(a.y, b.y);
	return {
		x,
		y,
		width: Math.max(0, Math.min(a.x + a.width, b.x + b.width) - x),
		height: Math.max(0, Math.min(a.y + a.height, b.y + b.height) - y)
	};
}

/** The bitmap keeps its intrinsic aspect ratio while its clipping viewport changes. */
export function coverBox(box: Box, width: number, height: number, x = 0.5, y = 0.5): Box {
	const scale = Math.max(box.width / width, box.height / height);
	return {
		x: (box.width - width * scale) * x,
		y: (box.height - height * scale) * y,
		width: width * scale,
		height: height * scale
	};
}
