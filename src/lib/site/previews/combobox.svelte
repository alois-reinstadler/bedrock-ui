<script lang="ts">
	import { Combobox } from '#lib/bedrock/ui/combobox';

	const items = [
		{ value: 'ada', label: 'Ada Lovelace' },
		{ value: 'grace', label: 'Grace Hopper' },
		{ value: 'edsger', label: 'Edsger Dijkstra' },
		{ value: 'barbara', label: 'Barbara Liskov' }
	];
	let value = $state('');
</script>

<div class="flex max-w-64 flex-col gap-2">
	<Combobox {items} bind:value placeholder="Assign a reviewer…" />
	{#if value}<p class="text-sm text-muted-foreground">Selected: {value}</p>{/if}
</div>
