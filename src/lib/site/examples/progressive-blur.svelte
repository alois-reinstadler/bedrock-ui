<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { ProgressiveBlur, type ProgressiveBlurSide } from '#lib/bedrock/ui/progressive-blur';

	const sides: Array<{ side: ProgressiveBlurSide; label: string }> = [
		{ side: 'top', label: 'Top' },
		{ side: 'right', label: 'Right' },
		{ side: 'bottom', label: 'Bottom' },
		{ side: 'left', label: 'Left' }
	];
</script>

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
