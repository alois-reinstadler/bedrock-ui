import { getContext, setContext, untrack } from 'svelte';
import { hsvToHex, hsvToHsl, hsvToRgb, parseColor, type HsvColor } from './hsv.js';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';
export type ColorControlProps = {
	value?: string;
	onValueChange?: (value: string) => void;
	alpha?: boolean;
	disabled?: boolean;
	name?: string;
};
export const defaultSwatches = [
	'#ef4444',
	'#f97316',
	'#fbbf24',
	'#10b981',
	'#0ea5e9',
	'#8b5cf6',
	'#ec4899',
	'#334155'
];
interface Options {
	value: () => string | undefined;
	alpha: () => boolean | undefined;
	disabled: () => boolean | undefined;
	change: (value: string) => void;
}
const key = Symbol('bedrock-color-picker');
export interface ColorState {
	readonly hsv: HsvColor;
	readonly alpha: boolean;
	readonly disabled: boolean;
	readonly value: string;
	commit(next: HsvColor): void;
}
export function createColorState(options: Options, inherit = true): ColorState {
	const parent = inherit ? getContext<ColorState | undefined>(key) : undefined;
	const inherited = $derived(Boolean(parent && options.value() === undefined));
	let remembered = $state<HsvColor>(
		untrack(() => parseColor(options.value() ?? '#6e56cf') ?? { h: 260, s: 0.6, v: 0.8, a: 1 })
	);
	const alpha = $derived(options.alpha() ?? (inherited ? parent?.alpha : false) ?? false);
	const disabled = $derived(Boolean(options.disabled() || (inherited && parent?.disabled)));
	// Hue is historical state: gray/black external values must retain the most
	// recently received hue, not only the last hue selected inside this control.
	// Observe the external source only; the untracked comparison prevents our
	// memory update from scheduling itself or emitting a value-change callback.
	function rememberExternalColor() {
		if (inherited) return;
		const incoming = options.value();
		const includeAlpha = alpha;
		untrack(() => {
			if (incoming === undefined) return;
			const parsed = parseColor(incoming, remembered.h);
			if (parsed && hsvToHex(parsed, includeAlpha) !== hsvToHex(remembered, includeAlpha)) {
				remembered = parsed;
			}
		});
	}
	$effect.pre(rememberExternalColor);
	const hsv = $derived.by(() => {
		if (inherited && parent) return parent.hsv;
		const parsed = parseColor(options.value() ?? hsvToHex(remembered, alpha), remembered.h);
		return !parsed || hsvToHex(parsed, alpha) === hsvToHex(remembered, alpha) ? remembered : parsed;
	});
	return {
		get hsv() {
			return hsv;
		},
		get alpha() {
			return alpha;
		},
		get disabled() {
			return disabled;
		},
		get value() {
			return hsvToHex(hsv, alpha);
		},
		commit(next: HsvColor) {
			if (disabled) return;
			if (inherited && parent) {
				parent.commit(next);
				return;
			}
			remembered = next;
			options.change(hsvToHex(next, alpha));
		}
	};
}
export function provideColorState(state: ColorState) {
	setContext(key, state);
}
export function colorText(hsv: HsvColor, format: ColorFormat, alpha = false) {
	if (format === 'hex') return hsvToHex(hsv, alpha);
	const opacity = Math.round(hsv.a * 1000) / 1000;
	if (format === 'hsl') {
		const hsl = hsvToHsl(hsv);
		return alpha ? hsl.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`) : hsl;
	}
	const { r, g, b } = hsvToRgb(hsv);
	return alpha ? `rgba(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r}, ${g}, ${b})`;
}
export function colorKey(event: KeyboardEvent, state: ColorState, axis: keyof HsvColor) {
	if (state.disabled) return;
	const max = axis === 'h' ? 359 : 100;
	const current = axis === 'h' ? state.hsv.h : state.hsv[axis] * 100;
	const step = event.shiftKey ? 10 : 1;
	let next: number;
	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowUp':
			next = current + step;
			break;
		case 'ArrowLeft':
		case 'ArrowDown':
			next = current - step;
			break;
		case 'PageUp':
			next = current + 10;
			break;
		case 'PageDown':
			next = current - 10;
			break;
		case 'Home':
			next = 0;
			break;
		case 'End':
			next = max;
			break;
		default:
			return;
	}
	event.preventDefault();
	const absolute = event.key === 'Home' || event.key === 'End';
	const resolved =
		axis === 'h' && !absolute ? ((next % 360) + 360) % 360 : Math.max(0, Math.min(max, next));
	state.commit({ ...state.hsv, [axis]: axis === 'h' ? resolved : resolved / 100 });
}
export function colorPointer(
	node: HTMLElement,
	state: ColorState,
	update: (x: number, y: number) => void
) {
	const move = (event: PointerEvent) => {
		if (state.disabled) return;
		const rect = node.getBoundingClientRect();
		if (!rect.width) return;
		update(
			Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
			rect.height ? Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) : 0
		);
	};
	const down = (event: PointerEvent) => {
		if (state.disabled || event.button > 0) return;
		event.preventDefault();
		node.focus();
		try {
			node.setPointerCapture(event.pointerId);
		} catch {
			/* Synthetic events have no active pointer. */
		}
		move(event);
	};
	const drag = (event: PointerEvent) => {
		if (node.hasPointerCapture(event.pointerId)) move(event);
	};
	const up = (event: PointerEvent) => {
		if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
	};
	node.addEventListener('pointerdown', down);
	node.addEventListener('pointermove', drag);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', up);
	return () => {
		node.removeEventListener('pointerdown', down);
		node.removeEventListener('pointermove', drag);
		node.removeEventListener('pointerup', up);
		node.removeEventListener('pointercancel', up);
	};
}
