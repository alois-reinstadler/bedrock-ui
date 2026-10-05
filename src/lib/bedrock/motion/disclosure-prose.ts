import type { Attachment } from 'svelte/attachments';
import { elementPrefersReducedMotion, observeMotionReduction } from './policy.js';
import { motionPresets } from './tokens.js';

/** Optional decorative paint on brief prose. Height/opacity remain reveal's sole property. */
export function disclosureProse(enabled: boolean): Attachment<HTMLElement> {
	return (node) => {
		if (!enabled) return;
		let animation: Animation | undefined;
		const settle = () => {
			if (animation) {
				animation.onfinish = null;
				animation.cancel();
			}
			animation = undefined;
		};
		const start = (event: Event) => {
			if (event.target !== node) return;
			settle();
			const copy = node.firstElementChild;
			if (
				!copy ||
				elementPrefersReducedMotion(node) ||
				node.contains(document.activeElement) ||
				copy.querySelector(
					'a, button, input, select, textarea, [tabindex], [contenteditable="true"]'
				)
			)
				return;
			animation = copy.animate([{ filter: 'blur(2px)' }, { filter: 'blur(0px)' }], {
				duration: motionPresets.hint.enter,
				easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
			});
			animation.onfinish = settle;
		};
		node.addEventListener('introstart', start);
		node.addEventListener('outrostart', settle);
		node.addEventListener('focusin', settle);
		const stop = observeMotionReduction(node, (reduced) => {
			if (reduced) settle();
		});
		return () => {
			settle();
			stop();
			node.removeEventListener('introstart', start);
			node.removeEventListener('outrostart', settle);
			node.removeEventListener('focusin', settle);
		};
	};
}

/** A Svelte outro can retain a frozen snippet. Make its semantic exit explicit,
 * while preserving consumer-owned force mounts and native until-found search. */
export function disclosureExit(enabled: boolean): Attachment<HTMLElement> {
	return (node) => {
		if (!enabled) return;
		const ariaHidden = node.getAttribute('aria-hidden');
		const enter = (event: Event) => {
			if (event.target !== node) return;
			node.inert = false;
			if (ariaHidden === null) node.removeAttribute('aria-hidden');
			else node.setAttribute('aria-hidden', ariaHidden);
		};
		const exit = (event: Event) => {
			if (event.target !== node) return;
			if (node.contains(document.activeElement) && node.id) {
				document
					.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(node.id)}"]`)
					?.focus({ preventScroll: true });
			}
			node.inert = true;
			node.setAttribute('aria-hidden', 'true');
		};
		node.addEventListener('introstart', enter);
		node.addEventListener('outrostart', exit);
		return () => {
			node.removeEventListener('introstart', enter);
			node.removeEventListener('outrostart', exit);
		};
	};
}
