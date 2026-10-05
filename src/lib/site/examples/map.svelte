<script lang="ts">
	import { NativeSelect } from '#lib/bedrock/ui/native-select';
	import type { Component } from 'svelte';
	import ExampleCard from '#lib/site/ExampleCard.svelte';
	import { mapExamples, mapCategories } from '../map-examples/catalog';
	const modules = import.meta.glob<{ default: Component }>('../map-examples/*Example.svelte');
	const sources = import.meta.glob<string>('../map-examples/*Example.svelte', {
		query: '?raw',
		import: 'default'
	});
	let selected = $state<string>('LocationsExample');
	const example = $derived(mapExamples.find((entry) => entry.file === selected)!);
	const loaded = $derived(
		Promise.all([
			modules[`../map-examples/${selected}.svelte`](),
			sources[`../map-examples/${selected}.svelte`]()
		])
	);
</script>

<div class="w-full min-w-0 space-y-4" data-map-gallery>
	<div class="space-y-2">
		<label for="map-example" class="text-sm font-medium">Map example</label>
		<NativeSelect
			id="map-example"
			bind:value={selected}
			class={['control-site-examples-map', 'w-full']}
		>
			{#each mapCategories as category (category)}
				<optgroup label={category}>
					{#each mapExamples.filter((entry) => entry.category === category) as entry (entry.file)}
						<option value={entry.file}>{category} — {entry.title}</option>
					{/each}
				</optgroup>
			{/each}
		</NativeSelect>
	</div>
	<p class="text-sm text-muted-foreground">
		Explore nine categories of Bedrock maps. Select an example, then open Code to copy its complete
		source.
	</p>
	{#key selected}
		{#await loaded}
			<div class="grid h-[420px] place-items-center rounded-lg border" role="status">
				Loading example…
			</div>
		{:then [module, code]}
			<ExampleCard label={example.title} {code}>
				<div class="w-full min-w-0 overflow-hidden rounded-lg" data-map-example={selected}>
					<module.default />
				</div>
			</ExampleCard>
		{:catch}
			<p role="alert">
				The example could not be loaded. Choose another example or reload the page.
			</p>
		{/await}
	{/key}
	<p class="text-xs text-muted-foreground">
		Basemaps and remote datasets require network access. Location lists remain usable when map
		rendering is unavailable.
	</p>
</div>
