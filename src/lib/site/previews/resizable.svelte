<script lang="ts">
	import * as Resizable from '#lib/bedrock/ui/resizable';
</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
	<Resizable.Pane defaultSize={35}>
		<div class="flex h-32 items-center justify-center text-sm text-muted-foreground">Nav</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane>
		<div class="flex h-32 items-center justify-center text-sm text-muted-foreground">Content</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
