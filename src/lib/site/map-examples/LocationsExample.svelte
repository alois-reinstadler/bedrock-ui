<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import type { Map as MapInstance } from 'maplibre-gl';
	import { Map, MapControls, MapMarker, MarkerContent } from '#lib/bedrock/ui/map';

	const locations = [
		{
			name: 'Stephansplatz',
			address: 'Stephansplatz, 1010 Vienna',
			coordinates: [16.3738, 48.2082]
		},
		{
			name: 'MuseumsQuartier',
			address: 'Museumsplatz 1, 1070 Vienna',
			coordinates: [16.3595, 48.2033]
		},
		{
			name: 'Belvedere',
			address: 'Prinz Eugen-Straße 27, 1030 Vienna',
			coordinates: [16.3809, 48.1916]
		}
	] satisfies { name: string; address: string; coordinates: [number, number] }[];
	let map = $state<MapInstance | null>(null);
	let selected = $state.raw(locations[0]);

	function selectLocation(location: (typeof locations)[number]) {
		selected = location;
		map?.flyTo({ center: location.coordinates, zoom: 14 });
	}
</script>

<div class="grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
	<div class="space-y-3">
		<h4 class="font-medium">Explore Vienna</h4>
		<p class="text-sm text-muted-foreground">Choose a place from the list or its map marker.</p>
		<ul class="space-y-2" aria-label="Places in Vienna">
			{#each locations as location (location.name)}
				<li>
					<Button
						variant="ghost"
						type="button"
						aria-pressed={selected === location}
						onclick={() => selectLocation(location)}
						class={[
							'control-site-map-examples-locationsexample h-auto whitespace-normal',
							'w-full flex-col items-start gap-1 rounded-lg border p-3 text-start text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-muted'
						]}
					>
						<span class="block font-medium">{location.name}</span>
						<span class="text-muted-foreground">{location.address}</span>
					</Button>
				</li>
			{/each}
		</ul>
		<p role="status" class="text-sm">Selected: {selected.name}</p>
	</div>
	<div class="h-[420px] min-w-0 overflow-hidden rounded-lg border">
		<Map bind:map center={locations[0].coordinates} zoom={12}>
			<MapControls showCompass />
			{#each locations as location (location.name)}
				<MapMarker longitude={location.coordinates[0]} latitude={location.coordinates[1]}>
					<MarkerContent>
						<Button
							variant="ghost"
							type="button"
							aria-label={`Select ${location.name}`}
							aria-pressed={selected === location}
							onclick={() => selectLocation(location)}
							class={[
								'control-site-map-examples-locationsexample h-auto whitespace-normal',
								'rounded-full border-2 border-background bg-secondary px-3 py-1 text-sm text-secondary-foreground shadow aria-pressed:bg-primary aria-pressed:text-primary-foreground'
							]}
						>
							{location.name}
						</Button>
					</MarkerContent>
				</MapMarker>
			{/each}
		</Map>
	</div>
</div>
