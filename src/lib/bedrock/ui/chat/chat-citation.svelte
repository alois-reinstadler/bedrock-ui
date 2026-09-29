<script lang="ts">
	import * as Popover from '#lib/bedrock/ui/popover';
	import SourceCard from './chat-source-card.svelte';
	import type { ChatSource } from './agent-types';
	let {
		source,
		label = 'Source',
		open = $bindable(false)
	}: { source: ChatSource; label?: string; open?: boolean } = $props();
</script>

<Popover.Root {open} onOpenChange={(value) => (open = value)}>
	<Popover.Trigger
		data-slot="chat-citation"
		aria-label={`${label}: ${source.title}`}
		class="inline-flex rounded border bg-muted/50 px-1.5 align-baseline text-xs font-medium focus-visible:outline-2 focus-visible:outline-ring"
		>{label}</Popover.Trigger
	>
	<Popover.Content
		role="dialog"
		class="w-80 max-w-[calc(100vw-2rem)] p-0"
		aria-label={source.title}
	>
		<SourceCard {source} class="border-0" />
	</Popover.Content>
</Popover.Root>
