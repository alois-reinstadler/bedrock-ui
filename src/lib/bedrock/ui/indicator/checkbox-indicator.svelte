<script lang="ts" module>
	export type CheckboxIndicatorState = 'unchecked' | 'checked' | 'indeterminate';
</script>

<!--
	Purely decorative checkbox visual matching the shadcn Checkbox look.
	Always hidden from assistive technology — the OWNER control keeps the
	role, name, state, and focus, and can paint a focus ring on this root
	(one element, own border-radius).
-->
<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import CheckMark from '../checkbox/check-mark.svelte';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		state: indicatorState,
		size = 'md',
		disabled = false,
		children,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, HTMLSpanElement> & {
		state: CheckboxIndicatorState;
		size?: 'sm' | 'md';
		disabled?: boolean;
		/** Renders instead of the state mark, e.g. a Spinner while busy. */
		children?: Snippet;
	} = $props();

	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	const markClass = $derived(size === 'sm' ? 'size-3' : 'size-3.5');
</script>

<span
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="checkbox-indicator"
	data-state={indicatorState}
	aria-hidden="true"
	class={cn(
		'flex shrink-0 items-center justify-center rounded-[4px] border border-input text-current motion-state dark:bg-input/30',
		size === 'sm' ? 'size-4' : 'size-5',
		indicatorState !== 'unchecked' &&
			'border-primary bg-primary text-primary-foreground dark:bg-primary',
		disabled && 'opacity-50',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if indicatorState === 'checked'}
		<CheckMark class={markClass} animate={ready} />
	{:else if indicatorState === 'indeterminate'}
		<span class="h-0.5 w-1/2 rounded-full bg-current"></span>
	{/if}
</span>
