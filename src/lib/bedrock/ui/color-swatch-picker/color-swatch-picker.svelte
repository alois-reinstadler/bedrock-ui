<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import ColorSwatch from '../color-swatch/color-swatch.svelte';
	import {
		createColorState,
		defaultSwatches,
		type ColorControlProps
	} from '../color-picker/color-state.svelte.js';
	import { hsvToHex, parseColor } from '../color-picker/hsv.js';
	export type ColorSwatchPickerProps = WithElementRef<HTMLAttributes<HTMLDivElement>> &
		ColorControlProps & {
			swatches?: string[];
			label?: string;
			swatchLabel?: (value: string) => string;
		};
	let {
		value = $bindable(undefined),
		onValueChange,
		alpha,
		disabled,
		name,
		ref = $bindable(null),
		class: className,
		swatches = defaultSwatches,
		label = 'Color palette',
		swatchLabel = (color) => `Choose ${color}`,
		...rest
	}: ColorSwatchPickerProps = $props();
	const state = createColorState({
		value: () => value,
		alpha: () => alpha,
		disabled: () => disabled,
		change: (next) => {
			value = next;
			onValueChange?.(next);
		}
	});
	const colors = $derived(
		swatches
			.map((color) => ({ color, parsed: parseColor(color, state.hsv.h) }))
			.filter((item) => item.parsed)
	);
	function choose(color: string) {
		const parsed = parseColor(color, state.hsv.h);
		if (parsed) state.commit(parsed);
	}
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="color-swatch-picker"
	role="group"
	aria-label={label}
	class={cn('grid grid-cols-8 gap-2.5', className)}
	{...rest}
>
	{#each colors as { color, parsed }, index (index)}
		<button
			type="button"
			aria-label={swatchLabel(color)}
			aria-pressed={parsed ? hsvToHex(parsed, state.alpha) === state.value : false}
			disabled={state.disabled}
			onclick={() => choose(color)}
			class="relative aspect-square w-full cursor-pointer rounded-md motion-state focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:ring-2 aria-pressed:ring-ring aria-pressed:ring-offset-2 aria-pressed:ring-offset-background"
			><ColorSwatch value={color} class="absolute inset-0 size-full" aria-hidden="true" /></button
		>
	{/each}
</div>
{#if name}<input type="hidden" {name} value={state.value} disabled={state.disabled} />{/if}
