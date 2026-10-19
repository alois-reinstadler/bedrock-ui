import { createContext } from 'svelte';
import type { Map, FlyToOptions } from 'maplibre-gl';

export type MapContext = {
	moveCamera: (options: FlyToOptions, fly?: boolean) => void;
	getMap: () => Map | null;
	isLoaded: () => boolean;
	isStyleReady: () => boolean;
	resolvedTheme: () => 'light' | 'dark';
};

const [readContext, writeContext, hasContext] = createContext<MapContext>();
export const setMapContext = writeContext;

export function getMapContext(): MapContext {
	if (!hasContext()) {
		throw new Error(
			'useMap must be called during initialization of a descendant of <Map>. Use bind:map to access the map from its parent.'
		);
	}
	return readContext();
}

/** Keep this object intact: its getters read the current provider state. */
export function useMap() {
	const context = getMapContext();
	return {
		get map() {
			return context.getMap();
		},
		get isLoaded() {
			return context.isLoaded();
		},
		get isStyleReady() {
			return context.isStyleReady();
		},
		get resolvedTheme() {
			return context.resolvedTheme();
		}
	};
}
