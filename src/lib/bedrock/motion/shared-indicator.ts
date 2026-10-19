/** Retained indicator geometry shared by tabs and navigation highlights.
 * CSS owns interpolation so interrupted moves continue from the painted position. */
export function positionIndicator(
	root: HTMLElement,
	mark: HTMLElement,
	target: HTMLElement,
	animate: boolean
) {
	const box = target.getBoundingClientRect();
	const origin = root.getBoundingClientRect();
	const transition = mark.style.transitionProperty;
	if (!animate) mark.style.transitionProperty = 'none';
	// Absolute children use the padding box; keep coordinates stable while scrolling.
	mark.style.left = `${box.left - origin.left - root.clientLeft + root.scrollLeft}px`;
	mark.style.top = `${box.top - origin.top - root.clientTop + root.scrollTop}px`;
	mark.style.width = `${box.width}px`;
	mark.style.height = `${box.height}px`;
	if (!animate) {
		// Commit initial/re-entered geometry without travelling from a stale target.
		void mark.offsetWidth;
		mark.style.transitionProperty = transition;
	}
}

export function observeIndicatorSizes(root: HTMLElement, selector: string, measure: () => void) {
	const sizes = new ResizeObserver(measure);
	const refresh = () => {
		sizes.disconnect();
		sizes.observe(root);
		// Siblings can move the selected item without resizing the container.
		for (const item of root.querySelectorAll(selector)) sizes.observe(item);
	};
	refresh();
	return { refresh, disconnect: () => sizes.disconnect() };
}

/** An item is on screen only where it intersects every clipping ancestor. */
export function isIndicatorTargetVisible(target: HTMLElement | null | undefined): boolean {
	if (!target?.isConnected || !target.getClientRects().length) return false;
	const box = target.getBoundingClientRect();
	let left = Math.max(0, box.left);
	let top = Math.max(0, box.top);
	let right = Math.min(document.documentElement.clientWidth, box.right);
	let bottom = Math.min(document.documentElement.clientHeight, box.bottom);
	for (let parent = target.parentElement; parent; parent = parent.parentElement) {
		const style = getComputedStyle(parent);
		const clip = parent.getBoundingClientRect();
		if (style.overflowX !== 'visible') {
			left = Math.max(left, clip.left + parent.clientLeft);
			right = Math.min(right, clip.left + parent.clientLeft + parent.clientWidth);
		}
		if (style.overflowY !== 'visible') {
			top = Math.max(top, clip.top + parent.clientTop);
			bottom = Math.min(bottom, clip.top + parent.clientTop + parent.clientHeight);
		}
	}
	return right > left && bottom > top;
}
