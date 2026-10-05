import { elementPrefersReducedMotion, observeMotionReduction } from '#lib/bedrock/motion/policy.js';

/** Translate wheel input while leaving animation timing to the browser. */
export function horizontalWheel(viewport: HTMLElement) {
	let scrolling = false;
	let target = viewport.scrollLeft;
	let direction = 1;

	const stop = () => {
		if (scrolling) viewport.scrollTo({ left: viewport.scrollLeft, behavior: 'instant' });
		scrolling = false;
	};
	const clamp = (value: number) => {
		const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
		return Math.max(0, Math.min(max, value * direction)) * direction;
	};
	const onScrollEnd = () => {
		scrolling = false;
	};
	const stopObservingMotion = observeMotionReduction(viewport, (reduced) => {
		if (!reduced || !scrolling) return;
		scrolling = false;
		viewport.scrollTo({ left: clamp(target), behavior: 'instant' });
	});

	const onWheel = (event: WheelEvent) => {
		// A nested ScrollArea owns its input, even at its boundary.
		if (
			event.target instanceof Element &&
			event.target.closest('[data-slot="scroll-area-viewport"]') !== viewport
		)
			return;
		// Keep zoom, modified gestures, and native horizontal trackpad input intact.
		if (
			event.defaultPrevented ||
			!event.cancelable ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey ||
			event.shiftKey ||
			event.deltaX !== 0 ||
			event.deltaY === 0
		) {
			stop();
			return;
		}

		const style = getComputedStyle(viewport);
		const nextDirection = style.direction === 'rtl' ? -1 : 1;
		const current = viewport.scrollLeft;
		if (nextDirection !== direction) stop();
		direction = nextDirection;
		const unit =
			event.deltaMode === WheelEvent.DOM_DELTA_PAGE
				? viewport.clientWidth
				: event.deltaMode === WheelEvent.DOM_DELTA_LINE
					? parseFloat(style.lineHeight) || 16
					: 1;
		const delta = event.deltaY * unit * direction;
		// Reversing starts from the visible position, discarding queued forward travel.
		const base = scrolling && Math.sign(delta) === Math.sign(target - current) ? target : current;
		const next = clamp(base + delta);
		if (Math.abs(next - current) < 0.01) {
			stop();
			return;
		}

		target = next;
		event.preventDefault();
		scrolling = !elementPrefersReducedMotion(viewport);
		viewport.scrollTo({ left: target, behavior: scrolling ? 'smooth' : 'instant' });
	};

	// The root also contains the draggable scrollbars, outside the viewport.
	const root = viewport.parentElement ?? viewport;
	viewport.addEventListener('wheel', onWheel, { passive: false });
	viewport.addEventListener('scrollend', onScrollEnd);
	root.addEventListener('pointerdown', stop, { passive: true });
	root.addEventListener('keydown', stop);
	return () => {
		stop();
		stopObservingMotion();
		viewport.removeEventListener('wheel', onWheel);
		viewport.removeEventListener('scrollend', onScrollEnd);
		root.removeEventListener('pointerdown', stop);
		root.removeEventListener('keydown', stop);
	};
}
