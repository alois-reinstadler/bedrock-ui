<script lang="ts">
	import { Map, MapPopup } from '#lib/bedrock/ui/map';
	import { Button } from '#lib/bedrock/ui/button';

	let showPopup = $state(true);
</script>

<div class="relative h-[420px] w-full">
	<Map center={[-74.006, 40.7128]} zoom={13}>
		{#if showPopup}
			<MapPopup
				longitude={-74.006}
				latitude={40.7128}
				closeButton
				focusAfterOpen={false}
				closeOnClick={false}
				onclose={() => (showPopup = false)}
			>
				<div class="space-y-2">
					<h3 class="font-semibold text-foreground">New York City</h3>
					<p class="text-sm text-muted-foreground">
						The city that never sleeps. Population: 8.3 million
					</p>
					<Button size="sm" variant="outline" class="w-full" onclick={() => (showPopup = false)}>
						Close
					</Button>
				</div>
			</MapPopup>
		{/if}
	</Map>

	{#if !showPopup}
		<Button size="sm" class="absolute bottom-4 left-4 z-10" onclick={() => (showPopup = true)}>
			Show Popup
		</Button>
	{/if}
</div>
