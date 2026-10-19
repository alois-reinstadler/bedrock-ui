<script lang="ts">
	import * as MapLibreGL from 'maplibre-gl';
	import { Map, MapPopup } from '#lib/bedrock/ui/map';

	// Generate random points around NYC
	function generateRandomPoints(count: number) {
		const center = { lng: -73.98, lat: 40.75 };
		const features = [];

		for (let i = 0; i < count; i++) {
			const lng = center.lng + (Math.random() - 0.5) * 0.15;
			const lat = center.lat + (Math.random() - 0.5) * 0.1;
			features.push({
				type: 'Feature' as const,
				properties: {
					id: i,
					name: `Location ${i + 1}`,
					category: ['Restaurant', 'Cafe', 'Bar', 'Shop'][Math.floor(Math.random() * 4)]
				},
				geometry: {
					type: 'Point' as const,
					coordinates: [lng, lat]
				}
			});
		}

		return {
			type: 'FeatureCollection' as const,
			features
		};
	}

	// 200 markers - would be slow with DOM markers, but fast with layers
	const pointsData = generateRandomPoints(200);

	interface SelectedPoint {
		id: number;
		name: string;
		category: string;
		coordinates: [number, number];
	}

	let selectedPoint: SelectedPoint | null = $state(null);

	let mapInstance = $state<MapLibreGL.Map | null>(null);
	function setupMapLayers() {
		const map = mapInstance;
		if (!map) return;
		map.addSource('layer-markers', { type: 'geojson', data: pointsData });
		map.addLayer({
			id: 'layer-markers',
			type: 'circle',
			source: 'layer-markers',
			paint: {
				'circle-radius': 6,
				'circle-color': '#3b82f6',
				'circle-stroke-width': 2,
				'circle-stroke-color': '#ffffff'
			}
		});
	}
	$effect(() => {
		const map = mapInstance;
		if (!map) return;
		const click = (event: MapLibreGL.MapLayerMouseEvent) => {
			const feature = event.features?.[0];
			if (!feature || feature.geometry.type !== 'Point') return;
			selectedPoint = {
				id: feature.properties.id,
				name: feature.properties.name,
				category: feature.properties.category,
				coordinates: feature.geometry.coordinates as [number, number]
			};
		};
		const enter = () => {
			map.getCanvas().style.cursor = 'pointer';
		};
		const leave = () => {
			map.getCanvas().style.cursor = '';
		};
		map.on('click', 'layer-markers', click);
		map.on('mouseenter', 'layer-markers', enter);
		map.on('mouseleave', 'layer-markers', leave);
		return () => {
			map.off('click', 'layer-markers', click);
			map.off('mouseenter', 'layer-markers', enter);
			map.off('mouseleave', 'layer-markers', leave);
		};
	});
</script>

<div class="h-[420px] w-full">
	<Map center={[-73.98, 40.75]} zoom={11} bind:map={mapInstance} onstyleloaded={setupMapLayers}>
		{#if selectedPoint}
			<MapPopup
				longitude={selectedPoint.coordinates[0]}
				latitude={selectedPoint.coordinates[1]}
				onclose={() => (selectedPoint = null)}
				closeOnClick={false}
				focusAfterOpen={false}
				offset={10}
				closeButton
			>
				<div class="min-w-24">
					<p class="font-medium">{selectedPoint.name}</p>
					<p class="text-sm text-muted-foreground">{selectedPoint.category}</p>
				</div>
			</MapPopup>
		{/if}
	</Map>
</div>
