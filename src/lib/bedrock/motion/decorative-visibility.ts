/** Pause decorative work outside the viewport or while the document is hidden.
 * This owns visibility only; callers retain user pause and reduced-motion policy. */
export function observeDecorativeVisibility(node: Element, update: (visible: boolean) => void) {
	const document = node.ownerDocument;
	let intersecting = false;
	const refresh = () => update(intersecting && document.visibilityState !== 'hidden');
	const Observer = document.defaultView?.IntersectionObserver;
	const observer = Observer
		? new Observer((entries) => {
				for (const entry of entries) if (entry.target === node) intersecting = entry.isIntersecting;
				refresh();
			})
		: undefined;
	// In older environments without observation, document visibility still applies.
	intersecting = !observer;
	observer?.observe(node);
	document.addEventListener('visibilitychange', refresh);
	refresh();
	return () => {
		observer?.disconnect();
		document.removeEventListener('visibilitychange', refresh);
	};
}

/** Inherit the clock only into a component's explicitly marked decorative layer. */
export function pauseDecorative(node: HTMLElement | SVGElement) {
	const previous = node.style.getPropertyValue('--bedrock-decorative-play-state');
	const dispose = observeDecorativeVisibility(node, (visible) => {
		node.style.setProperty('--bedrock-decorative-play-state', visible ? 'running' : 'paused');
	});
	return () => {
		dispose();
		if (previous) node.style.setProperty('--bedrock-decorative-play-state', previous);
		else node.style.removeProperty('--bedrock-decorative-play-state');
	};
}
