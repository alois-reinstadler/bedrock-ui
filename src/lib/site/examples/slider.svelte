<script lang="ts">
	import { Slider } from '#lib/bedrock/ui/slider';
	let value = $state(45);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
	<h3 class="font-medium">Reading comfort</h3>
	<p class="text-sm text-muted-foreground">
		Adjust the width of the article column. The preview updates as you move the slider.
	</p>
	<p id="reading-width-label" class="text-sm font-medium">Line length: {value} characters</p>
	<Slider
		type="single"
		bind:value
		min={30}
		max={70}
		step={5}
		aria-labelledby="reading-width-label"
	/>
	<article class="rounded-lg bg-muted p-4">
		<p class="text-sm leading-relaxed" style:max-width={value + 'ch'}>
			Good reading layouts balance comfortable line lengths with space for meaningful content. A
			narrower column helps readers keep their place as they move from one line to the next.
		</p>
	</article>
	<p class="text-xs text-muted-foreground">
		The current upstream Slider thumb-labeling limitation still applies; see the accessibility tab.
	</p>
</section>
