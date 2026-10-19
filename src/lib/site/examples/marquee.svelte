<script lang="ts">
	import { Marquee } from '#lib/bedrock/ui/marquee';
</script>

<div class="w-full max-w-2xl space-y-3">
	<p class="text-sm text-muted-foreground">A few things we believe in</p>
	<Marquee speed={32} gap={32}
		>{#each ['Thoughtful defaults', 'Room to explore', 'Made for people', 'Details matter'] as value (value)}<span
				class="shrink-0 rounded-lg border bg-card px-5 py-4 text-sm font-medium corner-theme"
				>{value}</span
			>{/each}</Marquee
	>
</div>
