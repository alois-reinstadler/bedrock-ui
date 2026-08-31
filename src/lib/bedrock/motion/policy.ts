const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export type MotionEnvironment = {
	matchMedia: (query: string) => { matches: boolean };
};

function globalMotionEnvironment(): MotionEnvironment | undefined {
	const environment = globalThis as typeof globalThis & Partial<MotionEnvironment>;
	return typeof environment.matchMedia === 'function'
		? (environment as MotionEnvironment)
		: undefined;
}

/** Read the current user preference without touching browser globals during SSR. */
export function prefersReducedMotion(environment = globalMotionEnvironment()): boolean {
	if (!environment) return false;
	try {
		return environment.matchMedia(REDUCED_MOTION_QUERY).matches;
	} catch {
		return false;
	}
}

/** Resolve one semantic duration at transition creation time. A zero duration
 * lets Svelte commit the final intro/outro state synchronously. */
export function resolveMotionDuration(
	duration: number,
	environment = globalMotionEnvironment()
): number {
	return prefersReducedMotion(environment) ? 0 : duration;
}
