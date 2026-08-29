<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Open menu</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
		<DropdownMenu.Label>Shift</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>File report</DropdownMenu.Item>
		<DropdownMenu.Item>Rotate crew</DropdownMenu.Item>
		<DropdownMenu.Item variant="destructive">Abandon face</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
