import { describe, expect, it, vi } from 'vitest';
import { createCameraMotion } from './camera-motion.js';

function fixture() {
	let reduced = false;
	const map = {
		easeTo: vi.fn(),
		flyTo: vi.fn(),
		stop: vi.fn(),
		isMoving: vi.fn(() => true)
	};
	// The camera seam deliberately uses only these five MapLibre methods.
	const camera = createCameraMotion(
		() => map as never,
		() => reduced
	);
	return { map, camera, reduce: () => (reduced = true) };
}

describe('map camera motion policy', () => {
	it('uses the existing camera owner normally and commits reduced destinations immediately', () => {
		const { map, camera, reduce } = fixture();
		camera.move({ zoom: 4 });
		expect(map.easeTo).toHaveBeenCalledWith({ zoom: 4 });
		reduce();
		camera.move({ zoom: 9 }, true);
		expect(map.flyTo).not.toHaveBeenCalled();
		expect(map.easeTo).toHaveBeenLastCalledWith({ zoom: 9, duration: 0, animate: false });
	});
	it('settles live reduction to the latest destination without replaying cancelled travel', () => {
		const { map, camera, reduce } = fixture();
		camera.move({ zoom: 4 });
		camera.move({ zoom: 8 }, true);
		reduce();
		camera.settle();
		expect(map.easeTo).toHaveBeenLastCalledWith({ zoom: 8, duration: 0, animate: false });
		map.isMoving.mockReturnValue(false);
		map.easeTo.mockClear();
		camera.settle();
		expect(map.easeTo).not.toHaveBeenCalled();
	});
	it('forgets completed camera requests before later gesture motion', () => {
		const { map, camera, reduce } = fixture();
		camera.move({ zoom: 8 });
		camera.clear();
		reduce();
		camera.settle();
		expect(map.stop).not.toHaveBeenCalled();
	});
});
