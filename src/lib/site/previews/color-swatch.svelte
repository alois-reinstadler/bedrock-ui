<script lang="ts">
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	const colors = [
		{ value: '#8b5cf6', label: 'Solid', opacity: '100%' },
		{ value: '#8b5cf680', label: 'Soft', opacity: '50%' },
		{ value: '#8b5cf620', label: 'Subtle', opacity: '12%' },
		{ value: '#8b5cf600', label: 'Clear', opacity: '0%' }
	];
</script>

<section class="w-full max-w-lg space-y-5 rounded-xl border bg-card p-5 corner-theme">
	<header>
		<h3 class="font-semibold">Color with transparency</h3>
		<p class="mt-1 text-sm text-muted-foreground">The same violet, at four levels of opacity.</p>
	</header>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each colors as color (color.label)}<div class="min-w-0 space-y-2">
				<ColorSwatch
					value={color.value}
					label={`${color.label} violet, ${color.opacity} opacity`}
					class="aspect-square h-auto w-full rounded-lg"
				/>
				<p class="text-sm font-medium">{color.label}</p>
				<p class="text-xs text-muted-foreground">{color.opacity}</p>
				<code class="text-[10px] text-muted-foreground">{color.value.toUpperCase()}</code>
			</div>{/each}
	</div>
	<p class="border-t pt-4 text-xs text-muted-foreground">
		Checkerboard areas show how much of the background remains visible.
	</p>
</section>
