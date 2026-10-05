export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

/** DOM-side counterpart for retained helpers that cannot read component context.
 * Any reduced ancestor wins, including a portal root carrying policy.attach. */
export function elementPrefersReducedMotion(element?: Element | null): boolean {
	return prefersReducedMotion() || Boolean(element?.closest?.('[data-bedrock-motion="reduced"]'));
}

/** Observe only this element's ancestor chain, never unrelated document scopes. */
export function observeMotionReduction(
	element: Element,
	changed: (reduced: boolean) => void
): () => void {
	const query = typeof matchMedia === 'function' ? matchMedia(REDUCED_MOTION_QUERY) : undefined;
	const notify = () => changed(elementPrefersReducedMotion(element));
	query?.addEventListener?.('change', notify);
	const observer =
		typeof MutationObserver === 'function' ? new MutationObserver(notify) : undefined;
	let ancestor: Element | null = element;
	while (ancestor) {
		observer?.observe(ancestor, { attributes: true, attributeFilter: ['data-bedrock-motion'] });
		ancestor = ancestor.parentElement;
	}
	return () => {
		query?.removeEventListener?.('change', notify);
		observer?.disconnect();
	};
}
