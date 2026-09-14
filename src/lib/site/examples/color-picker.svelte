<script lang="ts">
	import { ColorPicker } from '#lib/bedrock/ui/color-picker';
	import { Button } from '#lib/bedrock/ui/button';
	let value = $state('#6e56cf');
	let saved = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Customize a project marker</h3>
		<p class="text-sm text-muted-foreground">
			Use the selected color decoratively while keeping the project name and text contrast
			independent.
		</p>
	</header>
	<div class="grid gap-6 rounded-xl border bg-card p-5 sm:grid-cols-2">
		<div class="space-y-3">
			<p class="text-sm font-medium">Project accent</p>
			<ColorPicker variant="swatches" bind:value /><Button
				variant="outline"
				size="sm"
				onclick={() => (saved = `Project accent saved as ${value}.`)}>Save accent</Button
			>
		</div>
		<div class="space-y-3 rounded-lg border p-4">
			<div class="h-2 rounded-full" style:background-color={value}></div>
			<p class="font-medium">Field journal</p>
			<p class="text-sm text-muted-foreground">8 documents · Research workspace</p>
			<p class="font-mono text-xs">{value}</p>
		</div>
	</div>
	<p role="status" class="text-sm">{saved}</p>
</section>
