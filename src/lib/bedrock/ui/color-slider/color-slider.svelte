<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import {
		createColorState,
		colorKey,
		colorPointer,
		type ColorControlProps
	} from '../color-picker/color-state.svelte.js';
	import { hsvToHex } from '../color-picker/hsv.js';
	export type ColorSliderChannel = 'hue' | 'saturation' | 'brightness' | 'alpha';
	export type ColorSliderProps = WithElementRef<HTMLAttributes<HTMLDivElement>> &
		ColorControlProps & { channel?: ColorSliderChannel; label?: string };
	let {
		value = $bindable(undefined),
		onValueChange,
		alpha,
		disabled,
		name,
		ref = $bindable(null),
		class: className,
		channel = 'hue',
		label,
		...rest
	}: ColorSliderProps = $props();
	const state = createColorState({
		value: () => value,
		alpha: () => alpha ?? (channel === 'alpha' ? true : undefined),
		disabled: () => disabled,
		change: (next) => {
			value = next;
			onValueChange?.(next);
		}
	});
	const axis = $derived(
		({ hue: 'h', saturation: 's', brightness: 'v', alpha: 'a' } as const)[channel]
	);
	const max = $derived(channel === 'hue' ? 359 : 100);
	const current = $derived(channel === 'hue' ? state.hsv.h : state.hsv[axis] * 100);
	const opaque = $derived(hsvToHex(state.hsv));
	const background = $derived.by(() => {
		if (channel === 'hue') return 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
		if (channel === 'alpha')
			return `linear-gradient(to right,transparent,${opaque}),repeating-conic-gradient(var(--border) 0 25%,transparent 0 50%) 0 0 / 12px 12px`;
		return `linear-gradient(to right,${hsvToHex({ ...state.hsv, [axis]: 0 })},${hsvToHex({ ...state.hsv, [axis]: 1 })})`;
	});
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="color-slider"
	data-channel={channel}
	role="slider"
	tabindex={state.disabled ? -1 : 0}
	aria-disabled={state.disabled}
	aria-label={label ?? channel[0].toUpperCase() + channel.slice(1)}
	aria-orientation="horizontal"
	aria-valuemin={0}
	aria-valuemax={max}
	aria-valuenow={Math.round(current)}
	aria-valuetext={`${Math.round(current)}${channel === 'hue' ? ' degrees' : '%'}`}
	class={cn(
		'tap-target relative h-3 w-full cursor-pointer touch-none rounded-full border border-input select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
		className
	)}
	style={`background:${background}`}
	onkeydown={(event) => colorKey(event, state, axis)}
	{@attach (node) =>
		colorPointer(node, state, (x) =>
			state.commit({ ...state.hsv, [axis]: channel === 'hue' ? x * 359 : x })
		)}
	{...rest}
>
	<span
		class="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 shadow-sm ring-2 ring-white"
		style={`left:${(current / max) * 100}%;background:${channel === 'hue' ? hsvToHex({ h: state.hsv.h, s: 1, v: 1, a: 1 }) : opaque}`}
		aria-hidden="true"
	></span>
</div>
{#if name}<input type="hidden" {name} value={state.value} disabled={state.disabled} />{/if}
