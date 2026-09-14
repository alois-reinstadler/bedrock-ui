<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { ProgressiveBlur, type ProgressiveBlurSide } from '#lib/bedrock/ui/progressive-blur';

	const sides: Array<{ side: ProgressiveBlurSide; label: string }> = [
		{ side: 'top', label: 'Top' },
		{ side: 'right', label: 'Right' },
		{ side: 'bottom', label: 'Bottom' },
		{ side: 'left', label: 'Left' }
	];

	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	let reviewed = $state<string[]>([]);
	const updates = [
		'Design approved',
		'Pilot invited',
		'Copy reviewed',
		'Build verified',
		'Notes published',
		'Review scheduled'
	];
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Activity panel with soft edges</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			The activity panel hints at hidden content. Focus any action to clear the blur and preserve
			legibility. The comparison surfaces below cover all four physical edges.
		</p>
	</header>
	<ScrollArea class="h-56 rounded-lg border" edgeBlur="vertical"
		><div class="space-y-3 p-4">
			{#each updates as update (update)}<div
					class="flex items-center justify-between gap-3 rounded-lg bg-muted p-3"
				>
					<div>
						<p class="text-sm font-medium">{update}</p>
						<p class="text-xs text-muted-foreground">Workspace activity</p>
					</div>
					<Button
						size="sm"
						variant="outline"
						disabled={reviewed.includes(update)}
						onclick={() => (reviewed = [...reviewed, update])}
						>{reviewed.includes(update) ? 'Reviewed' : 'Review'}</Button
					>
				</div>{/each}
		</div></ScrollArea
	>

	<div class="grid gap-5">
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each sides as item (item.side)}
				<div class="relative h-36 overflow-hidden rounded-xl border bg-card shadow-xs">
					<div class="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-90">
						{#each Array.from({ length: 28 }, (_, index) => index) as index (index)}
							<span
								class="rounded-sm"
								class:bg-primary={index % 3 === 0}
								class:bg-foreground={index % 3 === 1}
								class:bg-muted-foreground={index % 3 === 2}
							></span>
						{/each}
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						<span
							class="rounded-full border bg-background/85 px-2.5 py-1 text-xs font-medium shadow-sm"
						>
							{item.label}
						</span>
					</div>
					<ProgressiveBlur side={item.side} size={72} strength={18} />
				</div>
			{/each}
		</div>

		<div
			class="relative h-44 overflow-hidden rounded-xl border bg-muted p-4 shadow-xs"
			style="--progressive-blur-fallback: var(--muted)"
		>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each ['Carbon', 'Cobalt', 'Ivory', 'Signal'] as sample, index (sample)}
					<div class="rounded-lg border bg-card p-3 shadow-sm">
						<div
							class="mb-8 h-14 rounded-md"
							class:bg-foreground={index % 2 === 0}
							class:bg-primary={index % 2 === 1}
						></div>
						<p class="text-sm font-medium">{sample}</p>
						<p class="text-xs text-muted-foreground">High-contrast sample</p>
					</div>
				{/each}
			</div>
			<Button variant="outline" class="absolute right-4 bottom-4">Inspect samples</Button>
			<ProgressiveBlur side="bottom" size="5.5rem" strength={22} />
		</div>
	</div>
</section>
