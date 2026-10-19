<script lang="ts">
	import { ColorSwatchPicker } from '#lib/bedrock/ui/color-swatch-picker';
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	let value = $state('#8b5cf6');
	const palette = [
		'#ef4444',
		'#f97316',
		'#f59e0b',
		'#10b981',
		'#06b6d4',
		'#3b82f6',
		'#8b5cf6',
		'#ec4899',
		'#fca5a5',
		'#fdba74',
		'#fcd34d',
		'#6ee7b7',
		'#67e8f9',
		'#93c5fd',
		'#c4b5fd',
		'#f9a8d4'
	];
</script>

<section class="w-full max-w-sm space-y-5 rounded-xl border bg-card p-5 corner-theme">
	<header>
		<h3 class="font-semibold">Project color</h3>
		<p class="mt-1 text-sm text-muted-foreground">Give your workspace a recognizable accent.</p>
	</header>
	<ColorSwatchPicker bind:value swatches={palette} label="Project accent palette" />
	<div class="flex items-center gap-3 rounded-lg border bg-background p-4">
		<ColorSwatch {value} />
		<div class="min-w-0 flex-1">
			<p class="text-sm font-medium">Website refresh</p>
			<p class="text-xs text-muted-foreground">Design workspace</p>
		</div>
	</div>
	<div class="flex justify-between border-t pt-4 text-xs">
		<span class="text-muted-foreground">Selected</span><output class="font-code"
			>{value.toUpperCase()}</output
		>
	</div>
</section>
