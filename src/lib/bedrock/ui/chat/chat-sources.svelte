<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Icon } from '#lib/bedrock/ui/icon';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import FilesIcon from '@lucide/svelte/icons/files';
	import SourceCard from './chat-source-card.svelte';
	import type { ChatSource } from './agent-types';
	import { cn } from '#lib/utils.js';
	let {
		sources = [],
		open = $bindable(false),
		label = 'Sources',
		emptyLabel = 'No sources available.',
		class: className
	}: {
		sources?: ChatSource[];
		open?: boolean;
		label?: string;
		emptyLabel?: string;
		class?: string;
	} = $props();
</script>

<Collapsible.Root
	data-slot="chat-sources"
	{open}
	onOpenChange={(next) => {
		open = next;
	}}
	class={cn('group/sources min-w-0 text-sm', className)}
>
	<Collapsible.Trigger
		class="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
	>
		<Icon icon={FilesIcon} class="size-3.5" />{label}
		<span class="tabular-nums">({sources.length})</span><Icon
			icon={ChevronDownIcon}
			class="size-3 transition-transform group-data-[state=open]/sources:rotate-180"
		/>
	</Collapsible.Trigger>
	<Collapsible.Content class="grid gap-2 pt-3 sm:grid-cols-2">
		{#each sources as source (source.id)}<SourceCard {source} />{:else}<p
				class="text-xs text-muted-foreground"
			>
				{emptyLabel}
			</p>{/each}
	</Collapsible.Content>
</Collapsible.Root>
