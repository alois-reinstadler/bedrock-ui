<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	// Import the lightweight entry, and get markers from the deferred snippet argument.
	import { LazyMap } from '#lib/bedrock/ui/map/lazy';
</script>

<div class="h-[420px] w-full">
	<LazyMap activation="interaction" center={[16.3738, 48.2082]} zoom={12}>
		{#snippet children({ MapControls, MapMarker, MarkerContent, MarkerPopup })}
			<MapControls />
			<MapMarker longitude={16.3738} latitude={48.2082}>
				<MarkerContent
					><Button
						variant="ghost"
						type="button"
						aria-label="Show Vienna"
						class={[
							'control-site-map-examples-lazymapexample h-auto whitespace-normal',
							'rounded-full bg-primary px-3 py-1 text-primary-foreground'
						]}>Vienna</Button
					></MarkerContent
				>
				<MarkerPopup closeButton>Vienna, Austria</MarkerPopup>
			</MapMarker>
		{/snippet}
	</LazyMap>
</div>
