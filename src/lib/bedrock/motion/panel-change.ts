import type { Attachment } from 'svelte/attachments';
import { untrack } from 'svelte';
import { elementPrefersReducedMotion, observeMotionReduction } from './policy.js';
import { motionPresets } from './tokens.js';

export type PanelMotion = 'none' | 'panel';

type PanelChangeState = { key: string; motion: PanelMotion; direction?: 'forward' | 'backward' };

/** Immediate semantic replacement with optional whole-panel paint. No retained,
 * focusable duplicate; no initial entry, compact spring or per-child stagger.
 * This is paint on immediately committed primitive DOM, not a second presence
 * engine: there is no retained exit, projection, gesture or spring lifecycle.
 * Shell height is measured only for explicit key changes, never incidental content. */
export function panelChange(
	getState: () => PanelChangeState,
	selector: string
): Attachment<HTMLElement> {
	return (root) => {
		let previous: string | undefined;
		let animations: Animation[] = [];
		let keyboard = false;
		let shell: Animation | undefined;
		let height = root.getBoundingClientRect().height;
		const settleShell = () => {
			if (shell) {
				shell.onfinish = null;
				shell.cancel();
			}
			shell = undefined;
			height = root.getBoundingClientRect().height;
		};
		const sizes = new ResizeObserver(() => {
			if (!shell) height = root.getBoundingClientRect().height;
		});
		sizes.observe(root);
		const settle = () => {
			for (const animation of animations) animation.cancel();
			animations = [];
			settleShell();
		};
		const onKey = () => {
			keyboard = true;
			settle();
		};
		const onPointer = () => {
			keyboard = false;
		};
		const onFocus = (event: FocusEvent) => {
			if (event.target instanceof Element && event.target.closest(selector)) settle();
		};
		root.addEventListener('keydown', onKey, true);
		root.addEventListener('pointerdown', onPointer, true);
		root.addEventListener('focusin', onFocus);
		const stopPolicy = observeMotionReduction(root, (reduced) => {
			if (reduced) settle();
		});
		const update = () => {
			const state = getState();
			const changed = previous !== undefined && previous !== '' && previous !== state.key;
			previous = state.key;
			if (!changed) {
				if (state.motion === 'none') settle();
				if (!shell) height = root.getBoundingClientRect().height;
				return;
			}
			const targets = [...root.querySelectorAll<HTMLElement>(selector)];
			const current = new Map(
				targets.map((node) => [
					node,
					{ opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform }
				])
			);
			const interrupted = animations.some((animation) => animation.playState === 'running');
			const fromHeight = shell ? root.getBoundingClientRect().height : height;
			settle();
			if (!changed || state.motion !== 'panel' || keyboard || elementPrefersReducedMotion(root))
				return;
			const toHeight = root.getBoundingClientRect().height;
			if (Math.abs(toHeight - fromHeight) > 0.5) {
				shell = root.animate(
					[
						{ height: `${fromHeight}px`, overflow: 'clip' },
						{ height: `${toHeight}px`, overflow: 'clip' }
					],
					{
						duration: motionPresets.reveal.duration,
						easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
					}
				);
				shell.onfinish = settleShell;
			}
			for (const node of targets) {
				if (node.contains(document.activeElement)) continue;
				const from = interrupted
					? current.get(node)!
					: { opacity: 0, transform: `translateX(${state.direction === 'backward' ? -4 : 4}px)` };
				const animation = node.animate([from, { opacity: 1, transform: 'none' }], {
					duration: motionPresets.enter.duration,
					easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
				});
				animations.push(animation);
			}
		};
		untrack(update);
		const observer = new MutationObserver(update);
		observer.observe(root, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['hidden', 'data-state', 'data-panel-motion']
		});
		return () => {
			observer.disconnect();
			settle();
			sizes.disconnect();
			stopPolicy();
			root.removeEventListener('keydown', onKey, true);
			root.removeEventListener('pointerdown', onPointer, true);
			root.removeEventListener('focusin', onFocus);
		};
	};
}
