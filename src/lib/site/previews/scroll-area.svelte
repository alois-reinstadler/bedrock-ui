<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Switch } from '#lib/bedrock/ui/switch';

	const id = $props.id();
	let edgeBlur = $state(true);
	let wheelToHorizontal = $state(true);
</script>

<div class="w-full min-w-0 space-y-4">
	<div class="flex items-center justify-between gap-4">
		<Label for={`${id}-blur`}>Progressive edge blur</Label>
		<Switch id={`${id}-blur`} bind:checked={edgeBlur} />
	</div>
	<p class="text-sm text-muted-foreground">
		Scroll to either end: blur appears only where more content is hidden. Toggle it to compare.
	</p>
	<div class="flex items-center justify-between gap-4">
		<Label for={`${id}-wheel`}>Mouse wheel scrolls horizontal panels</Label>
		<Switch id={`${id}-wheel`} bind:checked={wheelToHorizontal} />
	</div>
	<p class="text-sm text-muted-foreground">
		Hover a horizontal panel and use your mouse wheel. At either end, scrolling continues on the
		page.
	</p>

	<div class="grid min-w-0 gap-4 sm:grid-cols-2">
		<div class="min-w-0 space-y-2">
			<p class="text-sm font-medium">Vertical</p>
			<ScrollArea class="h-40 rounded-lg border" {edgeBlur}>
				<div class="space-y-3 p-4">
					{#each ['Overview', 'Activity', 'Members', 'Settings', 'Billing', 'Archive'] as item (item)}
						<p class="text-sm">{item}</p>
					{/each}
				</div>
			</ScrollArea>
		</div>
		<div class="min-w-0 space-y-2">
			<p class="text-sm font-medium">Horizontal</p>
			<ScrollArea
				class="h-40 rounded-lg border"
				orientation="horizontal"
				{wheelToHorizontal}
				{edgeBlur}
			>
				<div class="flex w-max gap-3 p-4">
					{#each ['Discover', 'Design', 'Build', 'Review'] as item (item)}
						<div class="flex h-28 w-36 items-center justify-center rounded-lg bg-muted text-sm">
							{item}
						</div>
					{/each}
				</div>
			</ScrollArea>
		</div>
	</div>
</div>
