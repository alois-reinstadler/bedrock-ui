<script lang="ts">
	import { untrack } from 'svelte';
	import { MediaQuery, SvelteMap } from 'svelte/reactivity';
	import * as DockLayout from '#lib/bedrock/ui/dock-layout';
	import { Button } from '#lib/bedrock/ui/button';
	import { Maximize2 } from '@lucide/svelte';

	// Choose a starting arrangement once; resizing the window must not discard user changes.
	const compact = new MediaQuery('(max-width: 640px)');
	const initial: DockLayout.LayoutConfig = {
		root: {
			direction: untrack(() => compact.current) ? 'vertical' : 'horizontal',
			splitPoints: [0.62],
			views: [
				{ tabs: ['brief', 'notes'], activeTabIndex: 0 },
				{ tabs: ['tasks'], activeTabIndex: 0 }
			]
		}
	};
	let config = $state(DockLayout.cloneConfig(initial));
	let saved = $state<DockLayout.LayoutConfig>();
	let status = $state('');
	const views = new SvelteMap<string, DockLayout.View>([
		['brief', { title: 'Project brief', snippet: brief }],
		['notes', { title: 'Notes', snippet: notes }],
		['tasks', { title: 'Checklist', snippet: tasks }]
	]);
</script>

{#snippet brief()}
	<article class="space-y-4 p-5">
		<p class="text-xs font-medium tracking-wide text-muted-foreground">WEBSITE REFRESH</p>
		<h4 class="text-xl font-semibold tracking-tight">A calmer place to work.</h4>
		<p class="text-sm leading-relaxed text-muted-foreground">
			Give the team a workspace that adapts to the task. Keep the brief nearby, collect notes, and
			make room for what matters next.
		</p>
		<div class="rounded-md border bg-muted/30 p-3 text-sm">
			<p class="font-medium">Ready for review</p>
			<p class="mt-1 text-muted-foreground">
				Navigation, component states, and responsive layouts.
			</p>
		</div>
	</article>
{/snippet}

{#snippet notes()}
	<div class="space-y-3 p-5">
		<h4 class="font-medium">Working notes</h4>
		<p class="text-sm text-muted-foreground">
			Keep labels short. Use the same spacing and focus treatment across every panel.
		</p>
		<p class="text-sm text-muted-foreground">
			Drag this tab to an edge to give your notes their own pane.
		</p>
	</div>
{/snippet}

{#snippet tasks()}
	<div class="space-y-4 p-5">
		<h4 class="font-medium">Before handoff</h4>
		<ul class="space-y-3 text-sm text-muted-foreground">
			<li class="border-b pb-3">Review content hierarchy</li>
			<li class="border-b pb-3">Check keyboard navigation</li>
			<li>Verify light and dark themes</li>
		</ul>
	</div>
{/snippet}

{#snippet maximize(id: string)}
	<Button
		variant="ghost"
		size="icon-sm"
		aria-label={`Maximize ${views.get(id)?.title}`}
		onclick={() => {
			config = { ...config, maximizedView: id };
		}}
	>
		<Maximize2 class="size-3.5" />
	</Button>
{/snippet}

<section class="space-y-3">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<h3 class="font-medium">Project workspace</h3>
		<div class="flex flex-wrap gap-2">
			{#if config.maximizedView}
				<Button
					size="sm"
					variant="outline"
					onclick={() => {
						config = { ...config, maximizedView: undefined };
					}}>Restore panels</Button
				>
			{/if}
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					saved = DockLayout.cloneConfig(config);
					status = 'Layout saved for this visit.';
				}}>Save layout</Button
			>
			<Button
				size="sm"
				variant="outline"
				disabled={!saved}
				onclick={() => {
					if (saved) config = DockLayout.cloneConfig(saved);
					status = 'Saved layout restored.';
				}}>Load saved</Button
			>
			<Button
				size="sm"
				variant="ghost"
				onclick={() => {
					config = DockLayout.cloneConfig(initial);
					status = 'Layout reset.';
				}}>Reset</Button
			>
		</div>
	</div>
	<p class="text-sm text-muted-foreground">
		Drag tabs between panels or to an edge. Resize a divider, or focus it and use the arrow keys.
		Focus a tab strip and use arrows to switch tabs; Alt + arrows creates a split.
	</p>
	<DockLayout.Root
		label="Project workspace"
		bind:config
		{views}
		tabgroupControls={[maximize]}
		showSplitRatio
		class="h-[26rem]"
	/>
	<p role="status" class="min-h-5 text-xs text-muted-foreground">{status}</p>
</section>
