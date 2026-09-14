<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Hover me</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Writes to the night log</Tooltip.Content>
</Tooltip.Root>
