<script lang="ts">
	import { ColorField } from '#lib/bedrock/ui/color-field';
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	let value = $state('#8b5cf6');
	const formats = ['hex', 'rgb', 'hsl'] as const;
</script>

<section class="w-full max-w-md space-y-5 rounded-xl border bg-card p-5 corner-theme">
	<header class="flex items-center gap-3">
		<ColorSwatch {value} class="size-11" />
		<div>
			<h3 class="font-semibold">One color, three formats</h3>
			<p class="mt-1 text-xs text-muted-foreground">Edit any value to update them all.</p>
		</div>
	</header>
	{#each formats as format (format)}<label class="grid gap-2"
			><span class="text-xs font-medium text-muted-foreground">{format.toUpperCase()}</span
			><ColorField bind:value {format} label={`${format.toUpperCase()} color`} /></label
		>{/each}
	<p class="border-t pt-4 text-xs leading-relaxed text-muted-foreground">
		Accepts HEX, RGB, and HSL. Invalid values stay editable; press Escape to restore the last valid
		color.
	</p>
</section>
