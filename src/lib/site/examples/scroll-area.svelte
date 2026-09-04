<script lang="ts">
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
</script>

<ScrollArea class="h-40 max-w-xs rounded-lg border p-3">
	<div class="space-y-2 text-sm">
		{#each Array.from({ length: 20 }, (_, i) => i + 1) as line (line)}
			<p>Ledger line {line}</p>
		{/each}
	</div>
</ScrollArea>
