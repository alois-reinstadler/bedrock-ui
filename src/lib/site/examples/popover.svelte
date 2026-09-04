<script lang="ts">
	import * as Popover from '#lib/bedrock/ui/popover';
	import { Button } from '#lib/bedrock/ui/button';
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Column widths</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 text-sm">
		<p class="font-medium">Column widths</p>
		<p class="mt-1 text-muted-foreground">
			Drag a header edge to resize; double-click to fit content.
		</p>
	</Popover.Content>
</Popover.Root>
