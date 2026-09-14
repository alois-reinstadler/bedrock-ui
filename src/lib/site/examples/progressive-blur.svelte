<script lang="ts">
	import { ProgressiveBlur } from '#lib/bedrock/ui/progressive-blur';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="relative h-40 overflow-hidden rounded-lg border bg-card p-4">
		<div class="space-y-3 text-sm leading-relaxed">
			{#each Array.from({ length: 8 }, (_, index) => index + 1) as item (item)}
				<p>Inspection note {item}: verify the next section before continuing.</p>
			{/each}
		</div>
		<ProgressiveBlur orientation="vertical" edge="end" />
	</div>

	<div class="relative h-40 overflow-hidden rounded-lg border bg-card p-4">
		<div class="flex w-max gap-3">
			{#each ['Overview', 'Activity', 'Invoices', 'Contacts', 'Files'] as item (item)}
				<div class="w-36 rounded-md border bg-background p-3 text-sm">{item}</div>
			{/each}
		</div>
		<ProgressiveBlur orientation="horizontal" edge="end" />
	</div>
</div>
