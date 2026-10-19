<script lang="ts">
	import { ColorPicker } from '#lib/bedrock/ui/color-picker';
	import { ColorSwatch } from '#lib/bedrock/ui/color-swatch';
	let value = $state('#8b5cf6');
	let marker = $state('#0ea5e9');
</script>

<div class="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
	<section class="min-w-0 space-y-5 rounded-xl border bg-card p-5 corner-theme">
		<header>
			<h3 class="font-semibold">Custom color</h3>
			<p class="mt-1 text-xs text-muted-foreground">
				Adjust the spectrum, opacity, or enter a value.
			</p>
		</header>
		<ColorPicker bind:value alpha class="max-w-none" />
		<div class="flex items-center justify-between border-t pt-4 text-xs">
			<span class="text-muted-foreground">Selected color</span><output class="font-code"
				>{value.toUpperCase()}</output
			>
		</div>
	</section>
	<section class="min-w-0 space-y-5 rounded-xl border bg-card p-5 corner-theme">
		<header>
			<h3 class="font-semibold">Quick palette</h3>
			<p class="mt-1 text-xs text-muted-foreground">A project accent in one click.</p>
		</header>
		<ColorPicker variant="swatches" bind:value={marker} class="max-w-none" />
		<div class="space-y-4 rounded-lg border bg-background p-4">
			<div class="h-1.5 rounded-full" style:background={marker}></div>
			<div class="flex items-center gap-3">
				<ColorSwatch value={marker} />
				<div>
					<p class="text-sm font-medium">Studio journal</p>
					<p class="text-xs text-muted-foreground">Research & inspiration</p>
				</div>
			</div>
			<p class="text-xs text-muted-foreground">12 notes · Updated today</p>
		</div>
		<output class="block font-code text-xs text-muted-foreground">{marker.toUpperCase()}</output>
	</section>
</div>
