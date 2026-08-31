import type { TransitionConfig } from 'svelte/transition';
import { springSamples } from './layout-math.js';
import { resolveMotionDuration } from './policy.js';
import { motionEasings, motionPresets } from './tokens.js';
import { motionDiagnostics } from './diagnostics.js';
import { beginLayoutExit, clearLayoutExit, readCommittedLayoutOffset } from './layout-offset.js';

let cachedLayoutSamples: number[] | null = null;
let cachedSwapSamples: number[] | null = null;
const warnedVanishNodes = new WeakSet<HTMLElement>();

function warnUnsupportedVanish(node: HTMLElement, style: CSSStyleDeclaration) {
	if (!import.meta.env.DEV || warnedVanishNodes.has(node)) return;
	const offsetParent = node.offsetParent;
	let unsupported = !offsetParent || style.position === 'fixed' || style.position === 'sticky';
	let ancestor = node.parentElement;
	while (!unsupported && ancestor && ancestor !== offsetParent) {
		const ancestorStyle = getComputedStyle(ancestor);
		const scrollable =
			ancestor.scrollWidth > ancestor.clientWidth || ancestor.scrollHeight > ancestor.clientHeight;
		const overflow = `${ancestorStyle.overflow} ${ancestorStyle.overflowX} ${ancestorStyle.overflowY}`;
		if (scrollable && /(auto|scroll|overlay|hidden)/.test(overflow)) {
			unsupported = true;
		}
		ancestor = ancestor.parentElement;
	}
	if (!unsupported) return;
	warnedVanishNodes.add(node);
	console.warn(`[Bedrock motion] ${motionDiagnostics.vanishContainingBlock}`, node);
}

function sampleSpring(t: number, samples: number[]): number {
	if (t <= 0) return 0;
	if (t >= 1) return 1;
	const position = t * (samples.length - 1);
	const index = Math.floor(position);
	const a = samples[index] ?? 1;
	const b = samples[index + 1] ?? 1;
	return a + (b - a) * (position - index);
}

function clampProgress(t: number): number {
	return Math.min(Math.max(t, 0), 1);
}

/** `start`/`end` used to be scale endpoints. Keep the same 0 → 1 intensity
 * direction while mapping it to an edge reveal that does not affect geometry. */
function clipInset(endpoint: number): number {
	return (1 - Math.min(Math.max(endpoint, 0), 1)) * 50;
}

/** The layout spring as a Svelte easing function, so presence transitions and
 * FLIP moves share one motion signature. May slightly overshoot 1. */
export function springEase(t: number): number {
	return sampleSpring(t, (cachedLayoutSamples ??= springSamples(motionPresets.layout.spring)));
}

/** Astryx's firmer content-swap spring, normalized to Swap's 400ms window. */
export function swapSpringEase(t: number): number {
	return sampleSpring(t, (cachedSwapSamples ??= springSamples(motionPresets.swap.spring)));
}

export function swapSpringOutroEase(t: number): number {
	return 1 - swapSpringEase(1 - t);
}

/** Mirror the reveal entrance curve for a simultaneous exit. With equal
 * clocks, outgoing and incoming heights remain complementary instead of
 * briefly shrinking and regrowing their combined flow space. */
export type RevealParams = {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
};

/** Enter/exit by animating the vertical box (height, paddings, margins,
 * borders) plus opacity. Because the height changes continuously, everything
 * below follows via native reflow — no layout() needed on siblings. Use for
 * accordion panels, validation errors, expanding details. */
export function reveal(node: Element, params: RevealParams = {}): TransitionConfig {
	const style = getComputedStyle(node);
	const opacity = Number.parseFloat(style.opacity);
	const height = Number.parseFloat(style.height);
	const paddingTop = Number.parseFloat(style.paddingTop);
	const paddingBottom = Number.parseFloat(style.paddingBottom);
	const marginTop = Number.parseFloat(style.marginTop);
	const marginBottom = Number.parseFloat(style.marginBottom);
	const borderTop = Number.parseFloat(style.borderTopWidth);
	const borderBottom = Number.parseFloat(style.borderBottomWidth);
	const duration = resolveMotionDuration(params.duration ?? motionPresets.reveal.duration);
	return {
		delay: duration === 0 ? 0 : (params.delay ?? 0),
		duration,
		easing: params.easing ?? motionEasings.enter,
		css: (t) =>
			`overflow: hidden;` +
			`min-height: 0;` +
			`opacity: ${Math.min(t, 1) * opacity};` +
			`height: ${t * height}px;` +
			`padding-top: ${t * paddingTop}px;` +
			`padding-bottom: ${t * paddingBottom}px;` +
			`margin-top: ${t * marginTop}px;` +
			`margin-bottom: ${t * marginBottom}px;` +
			`border-top-width: ${t * borderTop}px;` +
			`border-bottom-width: ${t * borderBottom}px;`
	};
}

export type AppearParams = {
	delay?: number;
	duration?: number;
	start?: number;
	easing?: (t: number) => number;
};

/** Enter with fade and a subtle edge reveal. Pairs with vanish for list items.
 * `start` remains an intensity control: 1 disables clipping; lower is stronger. */
export function appear(node: Element, params: AppearParams = {}): TransitionConfig {
	const opacity = Number.parseFloat(getComputedStyle(node).opacity);
	const inset = clipInset(params.start ?? 0.9);
	const duration = resolveMotionDuration(params.duration ?? motionPresets.enter.duration);
	return {
		delay: duration === 0 ? 0 : (params.delay ?? 0),
		duration,
		easing: params.easing ?? motionEasings.enter,
		css: (t) => {
			const progress = clampProgress(t);
			const clipped = ((1 - progress) * inset).toFixed(4);
			return `opacity: ${progress * opacity}; clip-path: inset(${clipped}%);`;
		}
	};
}

export type VanishParams = {
	delay?: number;
	duration?: number;
	end?: number;
	easing?: (t: number) => number;
};

/** Exit by pinning the node absolutely at its current spot, then fading and
 * clipping its edges in place. Pinning frees its layout slot immediately, so
 * siblings pack (via layout()) while the old content is still fading — the
 * container never waits for the exit to finish. Needs a positioned ancestor.
 * `end` remains an intensity control: 1 disables clipping; lower is stronger. */
export function vanish(node: HTMLElement, params: VanishParams = {}): TransitionConfig {
	const visualOffset = beginLayoutExit(node);
	const style = getComputedStyle(node);
	warnUnsupportedVanish(node, style);
	const opacity = Number.parseFloat(style.opacity);
	const inset = clipInset(params.end ?? 0.85);
	const committed = readCommittedLayoutOffset(node);
	const left = (committed?.left ?? node.offsetLeft) + visualOffset.x;
	const top = (committed?.top ?? node.offsetTop) + visualOffset.y;
	const width = committed?.width ?? node.offsetWidth;
	const height = committed?.height ?? node.offsetHeight;
	const duration = resolveMotionDuration(params.duration ?? motionPresets.exit.duration);
	let minimumProgress = 1;
	return {
		delay: duration === 0 ? 0 : (params.delay ?? 0),
		duration,
		easing: params.easing ?? motionEasings.exit,
		css: (t) => {
			const progress = clampProgress(t);
			const clipped = ((1 - progress) * inset).toFixed(4);
			return (
				`position: absolute;` +
				`left: ${left}px;` +
				`top: ${top}px;` +
				`width: ${width}px;` +
				`height: ${height}px;` +
				`box-sizing: border-box;` +
				`margin: 0;` +
				`opacity: ${progress * opacity};` +
				`clip-path: inset(${clipped}%);` +
				`z-index: 0;` +
				`pointer-events: none;`
			);
		},
		tick: (t) => {
			minimumProgress = Math.min(minimumProgress, t);
			if (t >= 0.999 && minimumProgress < 0.999) clearLayoutExit(node);
		}
	};
}

export type DrawerParams = {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
};

/** Horizontal reflow for rails and drawers. Siblings follow the real width
 * through normal layout rather than a competing projection. */
export function drawer(node: Element, params: DrawerParams = {}): TransitionConfig {
	const style = getComputedStyle(node);
	const opacity = Number.parseFloat(style.opacity);
	const width = Number.parseFloat(style.width);
	const paddingLeft = Number.parseFloat(style.paddingLeft);
	const paddingRight = Number.parseFloat(style.paddingRight);
	const duration = resolveMotionDuration(params.duration ?? motionPresets.overlay.duration);
	return {
		delay: duration === 0 ? 0 : (params.delay ?? 0),
		duration,
		easing: params.easing ?? motionEasings.drawer,
		css: (t) => {
			const progress = clampProgress(t);
			// Keep drawer copy optically gated until the real box can contain it.
			// Because this is derived from the same progress as width, a reversed
			// bidirectional transition cannot reveal content inside a narrow shell.
			const contentProgress = progress <= 0.55 ? 0 : progress >= 1 ? 1 : (progress - 0.55) / 0.45;
			return (
				`overflow: hidden;` +
				`min-width: 0;` +
				`opacity: ${contentProgress * opacity};` +
				`width: ${progress * width}px;` +
				`padding-left: ${progress * paddingLeft}px;` +
				`padding-right: ${progress * paddingRight}px;`
			);
		}
	};
}
