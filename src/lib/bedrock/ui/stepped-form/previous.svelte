<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import type { ComponentProps, Snippet } from 'svelte';
	import { getSteppedFormContext } from './context.js';
	type Props = Omit<ComponentProps<typeof Button>, 'href' | 'onclick'> & {
		children?: Snippet;
		onclick?: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => void;
	};
	let { children, onclick, disabled, ...restProps }: Props = $props();
	const context = getSteppedFormContext();
	const first = $derived(context.getSteps()[0]?.id === context.getCurrent());
</script>

<Button
	data-slot="stepped-form-previous"
	type="button"
	variant="outline"
	disabled={disabled || first || context.getDisabled()}
	onclick={(event) => {
		onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
		if (!event.defaultPrevented) void context.previous();
	}}
	{...restProps}
>
	{#if children}{@render children()}{:else}Back{/if}
</Button>
