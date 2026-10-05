import type { SelectionRect } from './target.js';

/** Keep the composer beside its target, with a clamped fallback on small screens. */
export function composerPosition(
	anchor: SelectionRect | undefined,
	size: { width: number; height: number },
	viewport: { width: number; height: number },
	dock?: SelectionRect
) {
	const gap = 12;
	const clampX = (x: number) => Math.max(gap, Math.min(x, viewport.width - size.width - gap));
	const clampY = (y: number) => Math.max(gap, Math.min(y, viewport.height - size.height - gap));
	const overlapsDock = (x: number, y: number) =>
		dock &&
		x < dock.x + dock.width + gap &&
		x + size.width > dock.x - gap &&
		y < dock.y + dock.height + gap &&
		y + size.height > dock.y - gap;
	if (anchor) {
		const centered = clampX(anchor.x + anchor.width / 2 - size.width / 2);
		const candidates = [
			{ x: centered, y: anchor.y + anchor.height + gap },
			{ x: centered, y: anchor.y - size.height - gap },
			{ x: anchor.x + anchor.width + gap, y: clampY(anchor.y) },
			{ x: anchor.x - size.width - gap, y: clampY(anchor.y) }
		];
		for (const point of candidates) {
			if (
				point.x >= gap &&
				point.y >= gap &&
				point.x + size.width <= viewport.width - gap &&
				point.y + size.height <= viewport.height - gap &&
				!overlapsDock(point.x, point.y)
			)
				return point;
		}
	}
	const x = clampX(
		anchor ? anchor.x + anchor.width / 2 - size.width / 2 : viewport.width - size.width - gap
	);
	const y = clampY(anchor ? anchor.y + anchor.height + gap : viewport.height - size.height - 76);
	if (dock && overlapsDock(x, y)) {
		return {
			x,
			y: clampY(
				dock.y >= viewport.height / 2 ? dock.y - size.height - gap : dock.y + dock.height + gap
			)
		};
	}
	return { x, y };
}
