<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import type { ChatSource } from './agent-types';
	import { chatSourceHref } from './agent-types';
	import { cn } from '#lib/utils.js';
	let { source, class: className }: { source: ChatSource; class?: string } = $props();
	const href = $derived(chatSourceHref(source.href));
</script>

<Card.Root
	data-slot="chat-source-card"
	role="article"
	class={cn('min-w-0 gap-0 bg-background py-0 shadow-none', className)}
>
	<Card.Content class="space-y-2 p-3">
		<div class="flex items-start gap-2.5">
			<span
				class="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
				><Icon icon={FileTextIcon} class="size-3.5" /></span
			>
			<div class="min-w-0 flex-1 space-y-0.5 break-words">
				{#if source.kind}<p
						class="text-[10px] font-medium tracking-wide text-muted-foreground uppercase"
					>
						{source.kind}
					</p>{/if}
				{#if href}<a
						{href}
						class="inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
						>{source.title}<Icon icon={ArrowUpRightIcon} class="size-3 text-muted-foreground" /></a
					>{:else}<p class="text-xs font-medium">{source.title}</p>{/if}
				{#if source.description}<p class="text-xs leading-relaxed text-muted-foreground">
						{source.description}
					</p>{/if}
			</div>
		</div>
		{#if source.excerpt}<blockquote
				class="rounded-md bg-muted/40 px-3 py-2 text-xs leading-relaxed break-words text-muted-foreground"
			>
				{source.excerpt}
			</blockquote>{/if}
	</Card.Content>
</Card.Root>
