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
	const steps = $derived(context.getSteps());
	const last = $derived(steps.at(-1)?.id === context.getCurrent());
</script>

<Button
	data-slot="stepped-form-next"
	type="button"
	disabled={disabled || last || context.getDisabled()}
	onclick={(event) => {
		onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
		if (!event.defaultPrevented) void context.next();
	}}
	{...restProps}
>
	{#if children}{@render children()}{:else}Continue{/if}
</Button>
