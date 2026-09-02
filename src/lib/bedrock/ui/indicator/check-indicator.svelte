<script lang="ts" module>
	export type CheckIndicatorState = 'unchecked' | 'checked';
</script>

<!--
	Purely decorative menu-style checkmark: nothing visible when unchecked,
	the registry `check` icon when checked. Always hidden from assistive
	technology — the OWNER control keeps role, name, state, and focus.
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		state,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, HTMLSpanElement> & {
		state: CheckIndicatorState;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="check-indicator"
	data-state={state}
	aria-hidden="true"
	class={cn(
		'flex size-4 shrink-0 items-center justify-center rounded-sm text-current motion-state',
		className
	)}
	{...restProps}
>
	{#if state === 'checked'}
		<Icon icon="check" class="size-4" />
	{/if}
</span>
