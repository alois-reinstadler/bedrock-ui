<script lang="ts">
	import * as Command from '#lib/bedrock/ui/command';
</script>

<Command.Root class="max-w-sm rounded-lg border shadow-sm">
	<Command.Input placeholder="Search actions…" />
	<Command.List>
		<Command.Empty>No results.</Command.Empty>
		<Command.Group heading="Orders">
			<Command.Item>Create order</Command.Item>
			<Command.Item>Export orders</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>Column layout<Command.Shortcut>⌘L</Command.Shortcut></Command.Item>
		</Command.Group>
	</Command.List>
</Command.Root>
