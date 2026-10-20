<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import * as DockLayout from '#lib/bedrock/ui/dock-layout';
	let config = $state<DockLayout.LayoutConfig>({
		root: {
			direction: 'horizontal',
			splitPoints: [0.6],
			views: [
				{ tabs: ['brief', 'notes'], activeTabIndex: 0 },
				{ tabs: ['tasks'], activeTabIndex: 0 }
			]
		}
	});
	const views = new SvelteMap<string, DockLayout.View>([
		['brief', { title: 'Brief', snippet: brief }],
		['notes', { title: 'Notes', snippet: notes }],
		['tasks', { title: 'Tasks', snippet: tasks }]
	]);
</script>

{#snippet brief()}<div class="space-y-2 p-3">
		<p class="text-sm font-medium">Your workspace</p>
		<p class="text-xs text-muted-foreground">Make room for what matters.</p>
	</div>{/snippet}
{#snippet notes()}<p class="p-3 text-xs text-muted-foreground">Drag tabs to rearrange.</p>{/snippet}
{#snippet tasks()}<p class="p-3 text-xs text-muted-foreground">
		Review<br />Refine<br />Share
	</p>{/snippet}

<DockLayout.Root label="Docking layout preview" bind:config {views} class="h-44 w-full" />
