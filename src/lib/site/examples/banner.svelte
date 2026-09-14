<script lang="ts">
	import * as Banner from '#lib/bedrock/ui/banner';
	import { Button } from '#lib/bedrock/ui/button';
	let open = $state(true);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Scheduled maintenance in a workspace</h3>
		<p class="text-sm text-muted-foreground">
			A dismissible announcement sits above the workflow and can be restored without losing the
			draft.
		</p>
	</header>
	<div class="overflow-hidden rounded-xl border bg-card">
		{#if open}<Banner.Root variant="info"
				><Banner.Content
					>Saving will pause Saturday, 22:00–22:15 UTC. Download important drafts beforehand.</Banner.Content
				><Banner.Close onclick={() => (open = false)} /></Banner.Root
			>{/if}
		<div class="space-y-3 p-5">
			<p class="font-medium">Project notes</p>
			<p class="text-sm text-muted-foreground">
				Your team can keep reviewing existing notes during maintenance.
			</p>
			{#if !open}<Button variant="outline" size="sm" onclick={() => (open = true)}
					>Show maintenance notice</Button
				>{/if}
		</div>
	</div>
</section>
