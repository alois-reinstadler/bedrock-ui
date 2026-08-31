import type { Attachment } from 'svelte/attachments';
import { resolveMotionDuration } from './policy.js';
import { motionPresets } from './tokens.js';

export type AutoSizeOptions = {
	duration?: number;
	easing?: string;
};

const DEFAULT_EASING = `cubic-bezier(${motionPresets.drawer.easing.join(', ')})`;

/** Animate a persistent shell between intrinsic block sizes without projecting
 * or scaling its descendants. This deliberately uses real height reflow, like
 * `reveal`, and is intended for small wrapping/content regions. */
export function autoSize(options: AutoSizeOptions = {}): Attachment<HTMLElement> {
	return (element) => {
		if (typeof requestAnimationFrame === 'undefined') return;

		let animation: Animation | null = null;
		let frame = 0;
		let disposed = false;
		let committedHeight = element.getBoundingClientRect().height;
		const duration = options.duration ?? motionPresets.reveal.duration;
		const easing = options.easing ?? DEFAULT_EASING;

		const finish = () => {
			const current = animation;
			animation = null;
			current?.cancel();
		};

		const resize = () => {
			frame = 0;
			if (disposed || !element.isConnected) return;
			const active = animation;
			const from = active ? element.getBoundingClientRect().height : committedHeight;
			const activeTime = active?.currentTime;
			const activeState = active?.playState;
			if (active) {
				active.onfinish = null;
				active.cancel();
				animation = null;
			}
			const to = element.getBoundingClientRect().height;
			if (active && Math.abs(to - committedHeight) < 0.5) {
				animation = active;
				active.currentTime = activeTime ?? null;
				active.onfinish = finish;
				if (activeState === 'paused') active.pause();
				else active.play();
				return;
			}
			committedHeight = to;
			const resolvedDuration = resolveMotionDuration(duration);
			if (
				resolvedDuration === 0 ||
				Math.abs(from - to) < 0.5 ||
				typeof element.animate !== 'function'
			) {
				return;
			}
			animation = element.animate(
				[
					{ height: `${from}px`, overflow: 'hidden', boxSizing: 'border-box' },
					{ height: `${to}px`, overflow: 'hidden', boxSizing: 'border-box' }
				],
				{ duration: resolvedDuration, easing, fill: 'both' }
			);
			animation.onfinish = finish;
		};

		const schedule = () => {
			if (disposed || frame) return;
			frame = requestAnimationFrame(resize);
		};

		const observer =
			typeof MutationObserver === 'function'
				? new MutationObserver((records) => {
						if (
							records.some((record) => record.target !== element || record.type !== 'attributes')
						) {
							schedule();
						}
					})
				: null;
		observer?.observe(element, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true
		});
		element.addEventListener('introstart', schedule);
		element.addEventListener('outrostart', schedule);
		element.addEventListener('introend', schedule);
		element.addEventListener('outroend', schedule);

		const motionQuery =
			typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
		const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
			if (!event.matches) return;
			if (animation) finish();
			committedHeight = element.getBoundingClientRect().height;
		};
		motionQuery?.addEventListener?.('change', onMotionPreferenceChange);

		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			observer?.disconnect();
			element.removeEventListener('introstart', schedule);
			element.removeEventListener('outrostart', schedule);
			element.removeEventListener('introend', schedule);
			element.removeEventListener('outroend', schedule);
			motionQuery?.removeEventListener?.('change', onMotionPreferenceChange);
			if (animation) finish();
		};
	};
}
