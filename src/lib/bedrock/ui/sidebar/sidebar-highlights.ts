import {
	positionIndicator,
	observeIndicatorSizes,
	isIndicatorTargetVisible
} from '../../motion/shared-indicator.js';
import { elementPrefersReducedMotion, observeMotionReduction } from '../../motion/policy.js';
import { motionPresets } from '../../motion/tokens.js';

const selector = '[data-sidebar="menu-button"], [data-sidebar="menu-sub-button"]';

/** One retained hover surface and one retained active surface for each sidebar. */
export function trackSidebarHighlights(root: HTMLElement) {
	const activeMark = root.querySelector<HTMLElement>('[data-slot="sidebar-active-highlight"]')!;
	const hoverMark = root.querySelector<HTMLElement>('[data-slot="sidebar-hover-highlight"]')!;
	let previous: HTMLElement | null | undefined;
	let hovered: HTMLElement | null = null;
	let entry: Animation | undefined;
	const owned = new Set<HTMLElement>();
	const belongs = (item: HTMLElement) => item.closest('[data-sidebar-highlights]') === root;
	const items = () => Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(belongs);
	const stopEntry = () => {
		entry?.cancel();
		entry = undefined;
	};
	const stopPolicy = observeMotionReduction(root, (reduced) => {
		if (reduced) stopEntry();
	});

	function place(mark: HTMLElement, target: HTMLElement | null, animate: boolean) {
		const visible = target && isIndicatorTargetVisible(target);
		if (target) {
			positionIndicator(root, mark, target, animate);
			// The overlay belongs to the sidebar, but must respect nested scroll viewports.
			const box = target.getBoundingClientRect();
			let top = 0,
				right = 0,
				bottom = 0,
				left = 0;
			for (
				let parent = target.parentElement;
				parent && parent !== root;
				parent = parent.parentElement
			) {
				const style = getComputedStyle(parent);
				const clip = parent.getBoundingClientRect();
				if (style.overflowY !== 'visible') {
					top = Math.max(top, clip.top + parent.clientTop - box.top);
					bottom = Math.max(bottom, box.bottom - clip.top - parent.clientTop - parent.clientHeight);
				}
				if (style.overflowX !== 'visible') {
					left = Math.max(left, clip.left + parent.clientLeft - box.left);
					right = Math.max(right, box.right - clip.left - parent.clientLeft - parent.clientWidth);
				}
			}
			// Clip only the scroll viewport; each surface owns its themed corners.
			mark.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
		}
		mark.dataset.visible = String(Boolean(visible));
	}

	function measure(animate = true) {
		const buttons = items();
		for (const item of buttons) {
			item.setAttribute('data-sidebar-highlight-item', '');
			owned.add(item);
		}
		const active = buttons.find((item) => item.dataset.active === 'true') ?? null;
		const changed = active !== previous;
		const move =
			animate &&
			activeMark.dataset.visible === 'true' &&
			(!changed || isIndicatorTargetVisible(previous));
		if (changed) stopEntry();
		place(activeMark, active, move);
		if (
			changed &&
			previous !== undefined &&
			active &&
			!move &&
			!elementPrefersReducedMotion(root)
		) {
			entry = activeMark.animate(
				{ opacity: [0, 1], translate: ['0 3px', '0 0'] },
				{
					duration: motionPresets.enter.duration,
					easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
				}
			);
		}
		previous = active;
		if (
			hovered &&
			(!root.contains(hovered) || hovered.matches(':disabled, [aria-disabled="true"]'))
		)
			hovered = null;
		place(hoverMark, hovered, animate && hoverMark.dataset.visible === 'true');
	}
	const enter = (event: PointerEvent) => {
		if (event.pointerType === 'touch') return;
		const next =
			event.target instanceof Element ? event.target.closest<HTMLElement>(selector) : null;
		if (!next || !belongs(next) || next.matches(':disabled, [aria-disabled="true"]')) return;
		if (next !== hovered) {
			hovered = next;
			measure();
		}
	};
	const leave = () => {
		hovered = null;
		place(hoverMark, null, false);
	};
	const scroll = () => {
		if (hovered) hovered = items().find((item) => item.matches(':hover')) ?? null;
		measure(false);
	};
	const sizes = observeIndicatorSizes(root, selector, () => measure(false));
	const mutations = new MutationObserver((records) => {
		if (records.some((record) => record.type === 'childList')) sizes.refresh();
		measure();
	});
	mutations.observe(root, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: ['data-active', 'disabled', 'aria-disabled', 'class', 'data-state']
	});
	root.addEventListener('pointerover', enter);
	root.addEventListener('pointerleave', leave);
	window.addEventListener('scroll', scroll, true);
	measure(false);
	return () => {
		mutations.disconnect();
		sizes.disconnect();
		stopPolicy();
		stopEntry();
		root.removeEventListener('pointerover', enter);
		root.removeEventListener('pointerleave', leave);
		window.removeEventListener('scroll', scroll, true);
		for (const item of owned) item.removeAttribute('data-sidebar-highlight-item');
	};
}
