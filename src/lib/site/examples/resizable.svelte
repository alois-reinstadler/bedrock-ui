<script lang="ts">
	import * as Resizable from '#lib/bedrock/ui/resizable';
</script>

<section class="space-y-3">
	<h3 class="font-medium">Support inbox</h3>
	<p class="text-sm text-muted-foreground">
		Resize the message list to give a longer reply more room. The handle also supports keyboard
		adjustment.
	</p>
	<Resizable.PaneGroup direction="horizontal" class="min-h-64 rounded-xl border"
		><Resizable.Pane defaultSize={35} minSize={25}
			><div class="space-y-3 p-4">
				<p class="text-xs text-muted-foreground">ASSIGNED TO YOU</p>
				<p class="rounded-lg bg-muted p-3 text-sm font-medium">
					Mara Chen<br /><span class="font-normal">Invoice address correction</span>
				</p>
				<p class="p-3 text-sm">Ellis Ford<br />Delivery estimate</p>
			</div></Resizable.Pane
		><Resizable.Handle withHandle /><Resizable.Pane minSize={35}
			><article class="space-y-4 p-5">
				<h4 class="font-medium">Invoice address correction</h4>
				<p class="text-sm text-muted-foreground">From Mara Chen · Today at 09:42</p>
				<p class="text-sm">
					Could you update the billing address for our next invoice? The delivery address stays the
					same.
				</p>
				<p class="text-sm">Thanks for your help,<br />Mara</p>
			</article></Resizable.Pane
		></Resizable.PaneGroup
	>
</section>
