<script lang="ts">
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Empty from '#lib/bedrock/ui/empty';
</script>

<Empty.Root class="border border-dashed">
	<Empty.Header>
		<Empty.Media variant="icon">
			<InboxIcon />
		</Empty.Media>
		<Empty.Title>No samples yet</Empty.Title>
		<Empty.Description>Seal a core from the east face to populate this log.</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<Button size="sm">New sample</Button>
	</Empty.Content>
</Empty.Root>
