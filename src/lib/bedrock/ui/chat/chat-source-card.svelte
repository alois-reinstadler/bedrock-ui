<script lang="ts">
	import type { ChatSource } from './agent-types';
	import { chatSourceHref } from './agent-types';
	import { cn } from '#lib/utils.js';
	let { source, class: className }: { source: ChatSource; class?: string } = $props();
	const href = $derived(chatSourceHref(source.href));
</script>

<article
	data-slot="chat-source-card"
	class={cn('min-w-0 space-y-2 rounded-lg border bg-background p-3 text-sm break-words', className)}
>
	{#if source.kind}<p class="text-xs text-muted-foreground">{source.kind}</p>{/if}
	{#if href}<a
			{href}
			class="font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
			>{source.title}</a
		>{:else}<p class="font-medium">{source.title}</p>{/if}
	{#if source.description}<p class="text-xs text-muted-foreground">{source.description}</p>{/if}
	{#if source.excerpt}<blockquote class="border-l-2 pl-3 text-muted-foreground">
			{source.excerpt}
		</blockquote>{/if}
</article>
