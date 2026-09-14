<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { cn } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSteppedFormContext } from './context.js';
	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const context = getSteppedFormContext();
</script>

<div
	data-slot="stepped-form-status"
	aria-live="polite"
	aria-atomic="true"
	class={cn(
		'min-h-5 text-sm',
		context.getStatus() === 'error' ? 'text-destructive' : 'text-muted-foreground',
		className
	)}
	{...restProps}
>
	{context.getMessage()}
	{#if context.getStatus() === 'error'}
		<Button
			type="button"
			variant="link"
			size="sm"
			class="ml-1 h-auto p-0"
			onclick={() => void context.retry()}>Retry</Button
		>
	{/if}
</div>
