<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Marker from '#lib/bedrock/ui/marker';
	import CheckIcon from '@lucide/svelte/icons/check';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	let complete = $state(false);
</script>

<section class="w-full max-w-lg space-y-6" aria-label="Marker example">
	<Marker.Root variant="separator"><Marker.Content>Today</Marker.Content></Marker.Root>
	<Marker.Root role="status"
		><Marker.Icon><CheckIcon /></Marker.Icon><Marker.Content
			>{complete
				? 'Review complete. All changes are ready.'
				: 'Changes are ready for your review.'}</Marker.Content
		></Marker.Root
	>
	<Marker.Root variant="border"><Marker.Content>Release notes updated</Marker.Content></Marker.Root>
	<Marker.Root
		>{#snippet child({ props })}<Button
				variant="ghost"
				{...props}
				type="button"
				onclick={() => (complete = !complete)}
				><Marker.Icon><RefreshCwIcon /></Marker.Icon><Marker.Content
					>{complete ? 'Restart review' : 'Complete review'}</Marker.Content
				></Button
			>{/snippet}</Marker.Root
	>
</section>
