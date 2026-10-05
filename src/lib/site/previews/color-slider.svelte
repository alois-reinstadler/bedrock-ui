<script lang="ts">
	import { ColorSlider } from '#lib/bedrock/ui/color-slider';
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	import { parseColor } from '#lib/bedrock/ui/color-picker';
	let value = $state('#8b5cf6cc');
	const hsv = $derived(parseColor(value)!);
	const channels = ['hue', 'saturation', 'brightness', 'alpha'] as const;
</script>

<section class="w-full max-w-md space-y-6 rounded-xl border bg-card p-5 corner-theme">
	<header class="flex items-center gap-3">
		<ColorSwatch {value} class="size-11" />
		<div>
			<h3 class="font-semibold">Fine-tune your color</h3>
			<output class="font-code text-xs text-muted-foreground">{value.toUpperCase()}</output>
		</div>
	</header>
	{#each channels as channel (channel)}
		<div class="space-y-3">
			<div class="flex justify-between text-xs">
				<span class="font-medium capitalize">{channel === 'alpha' ? 'Opacity' : channel}</span><span
					class="text-muted-foreground tabular-nums"
					>{Math.round(
						channel === 'hue'
							? hsv.h
							: hsv[({ saturation: 's', brightness: 'v', alpha: 'a' } as const)[channel]] * 100
					)}{channel === 'hue' ? '°' : '%'}</span
				>
			</div>
			<ColorSlider bind:value alpha {channel} />
		</div>
	{/each}
	<p class="border-t pt-4 text-xs text-muted-foreground">
		Use arrow keys for fine adjustments. Hold Shift for larger steps.
	</p>
</section>
