<script lang="ts">
	import * as ContextMenu from '#lib/bedrock/ui/context-menu';
	import { Button } from '#lib/bedrock/ui/button';
	let status = $state('');
	function duplicate() {
		status = 'Created Research plan (copy).';
	}
	function archive() {
		status = 'Research plan moved to the local archive.';
	}
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">File actions with a keyboard alternative</h3>
		<p class="text-sm text-muted-foreground">
			A context menu accelerates file work, while visible buttons keep the same actions
			discoverable.
		</p>
	</header>
	<ContextMenu.Root
		><ContextMenu.Trigger class="block rounded-xl border bg-card p-5"
			><p class="font-medium">Research plan.md</p>
			<p class="mt-1 text-sm text-muted-foreground">Updated today · 14 KB</p>
			<p class="mt-3 text-xs text-muted-foreground">
				Right-click for file actions, or use the buttons below.
			</p></ContextMenu.Trigger
		><ContextMenu.Content
			><ContextMenu.Item onSelect={duplicate}>Duplicate file</ContextMenu.Item><ContextMenu.Item
				onSelect={archive}>Archive file</ContextMenu.Item
			></ContextMenu.Content
		></ContextMenu.Root
	>
	<div class="flex flex-wrap gap-2">
		<Button variant="outline" size="sm" onclick={duplicate}>Duplicate file</Button><Button
			variant="outline"
			size="sm"
			onclick={archive}>Archive file</Button
		>
	</div>
	<p role="status" class="text-sm">{status}</p>
</section>
