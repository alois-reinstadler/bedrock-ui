<script lang="ts">
	import { ColorArea } from '#lib/bedrock/ui/color-area';
	import { ColorSlider } from '#lib/bedrock/ui/color-slider';
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	let value = $state('#8b5cf6');
</script>

<section class="w-full max-w-sm space-y-5 rounded-xl border bg-card p-5 corner-theme">
	<header>
		<h3 class="font-semibold">Find the right shade</h3>
		<p class="mt-1 text-sm text-muted-foreground">Move across for saturation, up for brightness.</p>
	</header>
	<ColorArea bind:value />
	<div class="space-y-3">
		<p class="text-xs font-medium text-muted-foreground">Hue</p>
		<ColorSlider bind:value channel="hue" />
	</div>
	<div class="flex items-center gap-3 border-t pt-4">
		<ColorSwatch {value} />
		<div>
			<p class="text-xs text-muted-foreground">Selected shade</p>
			<output class="font-code text-sm">{value.toUpperCase()}</output>
		</div>
	</div>
</section>
