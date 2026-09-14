<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { SelectableCard } from '#lib/bedrock/ui/selectable-card';

	const samples = [
		{ id: '07', note: 'Quartz vein, dry' },
		{ id: '08', note: 'Sealed at 31.8m' },
		{ id: '09', note: 'Pending analysis' }
	];

	let selected = $state<Record<string, boolean>>({ '07': false, '08': false, '09': false });
	const count = $derived(Object.values(selected).filter(Boolean).length);
</script>

<div class="flex flex-col gap-3">
	<div class="grid gap-3 sm:grid-cols-3">
		{#each samples as sample (sample.id)}
			<SelectableCard label={`Select core sample ${sample.id}`} bind:selected={selected[sample.id]}>
				<Card.Header>
					<Card.Title>Sample {sample.id}</Card.Title>
					<Card.Description>{sample.note}</Card.Description>
				</Card.Header>
			</SelectableCard>
		{/each}
	</div>
	<p class="text-sm text-muted-foreground" role="status">
		{count}
		{count === 1 ? 'sample' : 'samples'} selected
	</p>
</div>
