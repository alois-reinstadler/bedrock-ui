<script lang="ts">
	import * as Menubar from '#lib/bedrock/ui/menubar';
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>New order<Menubar.Shortcut>⌘N</Menubar.Shortcut></Menubar.Item>
			<Menubar.Item>Import…</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>Print</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.CheckboxItem checked>Show totals</Menubar.CheckboxItem>
			<Menubar.CheckboxItem>Compact rows</Menubar.CheckboxItem>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
