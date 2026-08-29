<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '#lib/bedrock/ui/alert';
</script>

<div class="grid max-w-lg gap-3">
	<Alert.Root>
		<CircleAlertIcon />
		<Alert.Title>Hold on east face</Alert.Title>
		<Alert.Description>Water ingress at 31.8m. Crew rotated at 02:14.</Alert.Description>
	</Alert.Root>
	<Alert.Root variant="destructive">
		<CircleAlertIcon />
		<Alert.Title>Pump fault</Alert.Title>
		<Alert.Description>Secondary pump dropped offline. Do not advance the face.</Alert.Description>
	</Alert.Root>
</div>
