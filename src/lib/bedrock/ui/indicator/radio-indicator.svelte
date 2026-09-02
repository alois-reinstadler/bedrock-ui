<script lang="ts" module>
	export type RadioIndicatorState = 'unchecked' | 'checked';
</script>

<!--
	Purely decorative radio visual matching the shadcn RadioGroup item look:
	bordered circle, filled dot when checked. Always hidden from assistive
	technology — the OWNER control keeps role, name, state, and focus, and
	can paint a focus ring on this root (one element, own border-radius).
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		state,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, HTMLSpanElement> & {
		state: RadioIndicatorState;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="radio-indicator"
	data-state={state}
	aria-hidden="true"
	class={cn(
		'flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-input motion-state dark:bg-input/30',
		state === 'checked' && 'border-primary bg-primary dark:bg-primary',
		className
	)}
	{...restProps}
>
	{#if state === 'checked'}
		<span class="size-2 rounded-full bg-primary-foreground"></span>
	{/if}
</span>
