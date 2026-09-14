<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import type { ComponentProps, Snippet } from 'svelte';
	import { getSteppedFormContext } from './context.js';
	let { children, disabled, ...restProps }: ComponentProps<typeof Button> & { children?: Snippet } =
		$props();
	const context = getSteppedFormContext();
</script>

<Button
	data-slot="stepped-form-submit"
	type="submit"
	disabled={disabled || context.getDisabled()}
	{...restProps}
>
	{#if children}{@render children()}{:else if context.getStatus() === 'submitting'}Submitting…{:else}Submit{/if}
</Button>
