import { getContext, setContext } from 'svelte';
export type SpotlightPoint = { x: number; y: number } | null;
export type SpotlightListener = (point: SpotlightPoint) => void;
const key = Symbol('bedrock-spotlight-group');
export function provideSpotlight() {
	const listeners = new Set<SpotlightListener>();
	const context = {
		register(listener: SpotlightListener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		move(point: SpotlightPoint) {
			for (const listener of listeners) listener(point);
		}
	};
	setContext(key, context);
	return context;
}
export function useSpotlight() {
	return getContext<ReturnType<typeof provideSpotlight> | undefined>(key);
}
