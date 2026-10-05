<script lang="ts">
	import { Map, MapGeoJSON } from '#lib/bedrock/ui/map';
	import { WORLD_GEOJSON } from './world-data.js';
</script>

<div class="h-[420px] w-full">
	<Map blank center={[10, 25]}>
		<MapGeoJSON data={WORLD_GEOJSON} linePaint={false} />
	</Map>
</div>
