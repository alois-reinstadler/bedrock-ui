<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Slider } from '#lib/bedrock/ui/slider';

	let value = $state(47);
	let hoverValue = $state(60);
</script>

<div class="grid max-w-sm gap-2">
	<Label>Depth {value}m</Label>
	<Slider type="single" {value} onValueChange={(next) => (value = next)} min={8} max={92} />
</div>

<div class="mt-6 grid max-w-sm gap-2">
	<Label id="slider-hover-label">Thumb on hover</Label>
	<div class="flex items-center gap-4">
		<Slider
			type="single"
			bind:value={hoverValue}
			thumbVisibility="hover"
			aria-labelledby="slider-hover-label"
		/>
		<span class="w-10 text-right text-sm text-muted-foreground tabular-nums">{hoverValue}%</span>
	</div>
	<p class="text-xs text-muted-foreground">Hover over the track to reveal the thumb.</p>
</div>

<div class="mt-4 grid max-w-sm gap-2">
	<Label>Disabled slider</Label><Slider type="single" value={30} disabled />
</div>
