<script lang="ts">
	import * as Marker from '#lib/bedrock/ui/marker';
	import CheckIcon from '@lucide/svelte/icons/check';
</script>

<div class="w-full max-w-lg space-y-6">
	<Marker.Root
		><Marker.Icon><CheckIcon /></Marker.Icon><Marker.Content>Synced all changes</Marker.Content
		></Marker.Root
	>
	<Marker.Root variant="separator"><Marker.Content>Today</Marker.Content></Marker.Root>
	<Marker.Root variant="border"><Marker.Content>Conversation archived</Marker.Content></Marker.Root>
</div>
