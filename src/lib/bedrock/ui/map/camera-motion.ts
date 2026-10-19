import type { FlyToOptions, Map } from 'maplibre-gl';

type Camera = Pick<Map, 'easeTo' | 'flyTo' | 'stop' | 'isMoving'>;

/** MapLibre owns the camera; Bedrock only resolves policy and the latest destination. */
export function createCameraMotion(getMap: () => Camera | null, reduced: () => boolean) {
	let destination: FlyToOptions | undefined;
	return {
		move(options: FlyToOptions, fly = false) {
			const map = getMap();
			if (!map) return;
			if (reduced()) {
				map.stop();
				map.easeTo({ ...options, duration: 0, animate: false });
			} else if (fly) map.flyTo(options);
			else map.easeTo(options);
			destination = reduced() ? undefined : options;
		},
		clear() {
			destination = undefined;
		},
		settle() {
			const map = getMap();
			if (!map || !reduced() || !destination || !map.isMoving()) return;
			const latest = destination;
			map.stop();
			if (latest) map.easeTo({ ...latest, duration: 0, animate: false });
			destination = undefined;
		}
	};
}
