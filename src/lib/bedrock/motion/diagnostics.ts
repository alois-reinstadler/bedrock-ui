export const motionDiagnostics = {
	missingGroup: 'layout() must be used inside <LayoutGroup>.',
	registrationFailed: 'Layout registration failed.',
	duplicateSharedId: (id: string) =>
		`Multiple live layout nodes use shared id "${id}" in one LayoutGroup. The latest owner wins.`,
	invalidTransition:
		'Invalid layout duration or spring values were ignored; the Astryx-aligned layout preset was used.',
	nestedCorrectionBoundary:
		'A nested layout node sits inside a data-layout-invert correction boundary. Use a separate content wrapper; descendant correction across that boundary is not projected.',
	waapiFallback: 'Web Animations playback failed; final static layout was kept.',
	authoredTransform:
		'A layout attachment found an authored transform. Put authored transforms or presence on an inner wrapper so projection retains sole transform ownership.',
	vanishContainingBlock:
		'vanish requires a stable local containing block with no scrolling ancestor between the exiting node and its offset parent. Fixed and sticky exits are unsupported.',
	flushGuard: (details: {
		group: string;
		count: number;
		span: number;
		cost: number;
		reason: string;
	}) =>
		`Layout updates for ${details.group} exceeded the animation-work guard (${details.count} flushes over ${Math.round(details.span)}ms, ${details.cost.toFixed(1)}ms setup; dominant signal: ${details.reason}). Playback is temporarily suppressed while final layout baselines continue to synchronize.`
} as const;

export function describeLayoutGroup(element: HTMLElement): string {
	if (element.id) return `#${element.id}`;
	const testId = element.dataset.testid;
	if (testId) return `[data-testid="${testId}"]`;
	const label = element.getAttribute('aria-label');
	if (label) return `${element.tagName.toLowerCase()}[aria-label="${label}"]`;
	return element.tagName.toLowerCase();
}
