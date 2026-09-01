<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLBlockquoteAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		cite: attribution,
		citeUrl,
		...restProps
	}: WithElementRef<Omit<HTMLBlockquoteAttributes, 'cite'>> & {
		cite?: string | Snippet;
		citeUrl?: string;
	} = $props();
</script>

{#snippet quote()}
	<blockquote
		bind:this={ref}
		data-slot="blockquote"
		cite={citeUrl}
		class={cn('border-s-2 border-border ps-4 text-muted-foreground', className)}
		{...restProps}
	>
		{@render children?.()}
	</blockquote>
{/snippet}

{#if attribution}
	<figure>
		{@render quote()}
		<figcaption class="mt-2 text-sm text-muted-foreground">
			— <cite
				>{#if typeof attribution === 'string'}{attribution}{:else}{@render attribution()}{/if}</cite
			>
		</figcaption>
	</figure>
{:else}
	{@render quote()}
{/if}
