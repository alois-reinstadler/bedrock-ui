<script lang="ts">
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

<details
	data-slot="chat-sources"
	bind:open
	class={cn('min-w-0 rounded-lg border bg-background text-sm', className)}
>
	<summary
		class="cursor-pointer rounded-lg p-3 font-medium focus-visible:outline-2 focus-visible:outline-ring"
		>{label} ({sources.length})</summary
	>
	<div class="grid gap-2 px-3 pb-3">
		{#each sources as source (source.id)}<SourceCard {source} />{:else}<p
				class="text-muted-foreground"
			>
				{emptyLabel}
			</p>{/each}
	</div>
</details>
