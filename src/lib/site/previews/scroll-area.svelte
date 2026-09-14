<script lang="ts">
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<ScrollArea class="h-32 rounded-lg border" edgeBlur="vertical"
		><div class="space-y-3 p-4">
			{#each ['Overview', 'Activity', 'Members', 'Settings', 'Billing', 'Archive'] as item (item)}<p
					class="text-sm"
				>
					{item}
				</p>{/each}
		</div></ScrollArea
	><ScrollArea class="h-32 rounded-lg border" orientation="horizontal" edgeBlur="horizontal"
		><div class="flex w-max gap-3 p-4">
			{#each ['Discover', 'Design', 'Build', 'Review'] as item (item)}<div
					class="rounded-lg bg-muted p-5 text-sm"
				>
					{item}
				</div>{/each}
		</div></ScrollArea
	>
</div>
