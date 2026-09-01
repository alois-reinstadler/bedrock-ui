<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { CitationSource } from './types.js';

	let {
		ref = $bindable(null),
		class: className,
		number,
		source,
		variant = 'label',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		number: number;
		source: CitationSource;
		variant?: 'label' | 'number';
	} = $props();

	const classes = $derived(
		cn(
			'motion-state inline-flex max-w-[16rem] items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			variant === 'label' && 'gap-1 bg-muted px-2 py-0.5 text-xs hover:bg-accent',
			variant === 'number' &&
				'relative -top-[0.35em] size-[1.1em] justify-center bg-muted text-[0.7em] leading-none hover:bg-accent',
			className
		)
	);
	const ariaLabel = $derived(`Source ${number}: ${source.title}`);
</script>

{#snippet content()}
	{#if variant === 'label'}
		{#if source.icon}<Icon icon={source.icon} class="size-3" />{/if}
		<span class="truncate">{source.title}</span>
	{:else}
		{number}
	{/if}
{/snippet}

{#if source.url}
	<a
		bind:this={ref}
		data-slot="citation"
		href={source.url}
		target="_blank"
		rel="noopener noreferrer"
		aria-label={ariaLabel}
		class={classes}
		{...restProps}
	>
		{@render content()}
	</a>
{:else}
	<span bind:this={ref} data-slot="citation" aria-label={ariaLabel} class={classes} {...restProps}>
		{@render content()}
	</span>
{/if}
