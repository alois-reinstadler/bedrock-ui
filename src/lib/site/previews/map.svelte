<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from '#lib/bedrock/ui/map';
</script>

<div class="h-[360px] w-full overflow-hidden rounded-lg border">
	<Map center={[16.3738, 48.2082]} zoom={12}>
		<MapControls showCompass />
		<MapMarker longitude={16.3738} latitude={48.2082}>
			<MarkerContent
				><Button
					variant="ghost"
					type="button"
					aria-label="Show Vienna"
					class={[
						'control-site-previews-map h-auto whitespace-normal',
						'rounded-full border-2 border-background bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow'
					]}>Vienna</Button
				></MarkerContent
			>
			<MarkerPopup closeButton
				><p class="font-medium">Vienna</p>
				<p class="text-sm text-muted-foreground">48.2082° N, 16.3738° E</p></MarkerPopup
			>
		</MapMarker>
	</Map>
</div>
