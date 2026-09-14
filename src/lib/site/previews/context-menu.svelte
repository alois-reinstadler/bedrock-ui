<script lang="ts">
	import * as ContextMenu from '#lib/bedrock/ui/context-menu';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-28 max-w-sm items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
	>
		Right-click here
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item>Open</ContextMenu.Item>
		<ContextMenu.Item>Duplicate</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
