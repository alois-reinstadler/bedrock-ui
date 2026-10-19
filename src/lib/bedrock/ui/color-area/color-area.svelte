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
	export type ColorAreaProps = WithElementRef<HTMLAttributes<HTMLDivElement>> &
		ColorControlProps & { label?: string; valueText?: (s: number, v: number) => string };
	let {
		value = $bindable(undefined),
		onValueChange,
		alpha,
		disabled,
		name,
		ref = $bindable(null),
		class: className,
		label = 'Saturation and brightness',
		valueText = (s, v) => `Saturation ${s}%, brightness ${v}%`,
		...rest
	}: ColorAreaProps = $props();
	const state = createColorState({
		value: () => value,
		alpha: () => alpha,
		disabled: () => disabled,
		change: (next) => {
			value = next;
			onValueChange?.(next);
		}
	});
	const uid = $props.id();
	const hue = $derived(hsvToHex({ h: state.hsv.h, s: 1, v: 1, a: 1 }));
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="color-area"
	role="slider"
	tabindex={state.disabled ? -1 : 0}
	aria-disabled={state.disabled}
	aria-label={label}
	aria-describedby={`${uid}-help`}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(state.hsv.s * 100)}
	aria-valuetext={valueText(Math.round(state.hsv.s * 100), Math.round(state.hsv.v * 100))}
	class={cn(
		'relative aspect-[4/3] w-full cursor-crosshair touch-none rounded-md border border-input select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
		className
	)}
	style={`background:linear-gradient(to top, #000, transparent),linear-gradient(to right,#fff,transparent),${hue}`}
	onkeydown={(event) => colorKey(event, state, event.altKey ? 'v' : 's')}
	{@attach (node) =>
		colorPointer(node, state, (x, y) => state.commit({ ...state.hsv, s: x, v: 1 - y }))}
	{...rest}
>
	<span
		class="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 shadow-sm ring-2 ring-white"
		style={`left:${state.hsv.s * 100}%;top:${(1 - state.hsv.v) * 100}%;background:${hsvToHex(state.hsv)}`}
		aria-hidden="true"
	></span>
</div>
<span id={`${uid}-help`} class="sr-only"
	>Use arrow keys for saturation. Hold Alt for brightness. Hold Shift for larger steps.</span
>
{#if name}<input type="hidden" {name} value={state.value} disabled={state.disabled} />{/if}
