<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { createColorState } from '../color-picker/color-state.svelte.js';
	export type ColorSwatchProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		value?: string;
		label?: string;
	};
	let {
		value,
		label,
		ref = $bindable(null),
		class: className,
		...rest
	}: ColorSwatchProps = $props();
	const state = createColorState({
		value: () => value,
		alpha: () => true,
		disabled: () => false,
		change: () => {}
	});
</script>

<span
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="color-swatch"
	role="img"
	aria-label={label ?? `Color ${state.value}`}
	class={cn(
		'relative inline-block size-8 shrink-0 overflow-hidden rounded-md border border-input align-middle',
		className
	)}
	style="background:repeating-conic-gradient(var(--border) 0 25%,var(--background) 0 50%) 0 0 / 10px 10px"
	{...rest}
	><span class="absolute inset-0" style={`background:${state.value}`} aria-hidden="true"
	></span></span
>
