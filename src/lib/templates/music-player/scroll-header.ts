const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
	const t = clamp(value);
	return t * t * (3 - 2 * t);
};

/** A single scroll progress coordinates the hero and the persistent navigation. */
export function albumScrollHeader(header: HTMLElement) {
	const pane = header.closest('main');
	const topbar = pane?.parentElement?.querySelector<HTMLElement>('[data-album-topbar]');
	const compact = topbar?.querySelector<HTMLElement>('[data-album-compact]');
	if (!pane || !topbar || !compact) return;
	const heroProperties = [
		'--album-scale',
		'--album-cover-y',
		'--album-cover-opacity',
		'--album-title-scale',
		'--album-title-y',
		'--album-title-opacity',
		'--album-details-opacity'
	];
	let frame = 0;
	let distance = 1;
	let enabled = false;
	pane.scrollTop = 0;

	function update() {
		frame = 0;
		const offset = Math.max(0, Math.min(pane!.scrollTop, distance));
		const progress = offset / distance;
		const reveal = smoothstep((progress - 0.48) / 0.42);
		// Transform and opacity only: the track list never reflows during a scroll.
		header.style.setProperty('--album-scale', String(1 - smoothstep(progress) * 0.35));
		header.style.setProperty('--album-cover-y', `${offset * 0.34}px`);
		header.style.setProperty(
			'--album-cover-opacity',
			String(1 - smoothstep((progress - 0.12) / 0.8))
		);
		header.style.setProperty('--album-title-scale', String(1 - smoothstep(progress) * 0.14));
		header.style.setProperty('--album-title-y', `${offset * 0.18}px`);
		header.style.setProperty(
			'--album-title-opacity',
			String(1 - smoothstep((progress - 0.2) / 0.65))
		);
		header.style.setProperty('--album-details-opacity', String(1 - smoothstep(progress / 0.65)));
		topbar!.style.setProperty('--album-reveal', String(reveal));
		const visible = reveal > 0.5;
		if (visible !== enabled) {
			enabled = visible;
			if (!visible && compact!.contains(document.activeElement)) {
				topbar!
					.querySelector<HTMLAnchorElement>('a[aria-label="Back to music"]')
					?.focus({ preventScroll: true });
			}
			compact!.inert = !visible;
			compact!.setAttribute('aria-hidden', String(!visible));
		}
	}

	function schedule() {
		if (!frame) frame = requestAnimationFrame(update);
	}
	function measure() {
		// Geometry is read only on resize, never inside the scrolling paint loop.
		distance = Math.max(1, header.offsetHeight + parseFloat(getComputedStyle(pane!).paddingTop));
		schedule();
	}
	const observer = new ResizeObserver(measure);
	observer.observe(header);
	observer.observe(pane);
	pane.addEventListener('scroll', schedule, { passive: true });
	measure();
	return () => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		pane.removeEventListener('scroll', schedule);
		for (const property of heroProperties) header.style.removeProperty(property);
		topbar.style.removeProperty('--album-reveal');
		compact.inert = true;
		compact.setAttribute('aria-hidden', 'true');
	};
}
