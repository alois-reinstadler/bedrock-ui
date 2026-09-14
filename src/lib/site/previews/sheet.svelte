<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Sheet from '#lib/bedrock/ui/sheet';
</script>

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Open sheet</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Night log</Sheet.Title>
			<Sheet.Description>Pumps, crew, and the last sealed core.</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
