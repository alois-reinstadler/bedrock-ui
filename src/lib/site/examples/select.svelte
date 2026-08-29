<script lang="ts">
	import * as Select from '#lib/bedrock/ui/select';

	const layers = [
		{ value: 'basalt', label: 'Basalt' },
		{ value: 'granite', label: 'Granite' },
		{ value: 'schist', label: 'Schist' }
	];

	let value = $state('basalt');
	let label = $derived(layers.find((layer) => layer.value === value)?.label ?? 'Layer');
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-56">
		{label}
	</Select.Trigger>
	<Select.Content>
		{#each layers as layer (layer.value)}
			<Select.Item value={layer.value} label={layer.label} />
		{/each}
	</Select.Content>
</Select.Root>
