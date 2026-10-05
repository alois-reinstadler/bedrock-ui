<script lang="ts">
	import { Toggle } from '#lib/bedrock/ui/toggle';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Underline from '@lucide/svelte/icons/underline';
	let bold = $state(true);
	let italic = $state(false);
	let underline = $state(false);
</script>

<div class="w-full max-w-lg overflow-hidden rounded-xl border bg-card corner-theme">
	<div class="flex items-center gap-1 border-b p-3" role="group" aria-label="Text formatting">
		<Toggle bind:pressed={bold} aria-label="Bold" variant="outline"><Bold class="size-4" /></Toggle>
		<Toggle bind:pressed={italic} aria-label="Italic" variant="outline"
			><Italic class="size-4" /></Toggle
		>
		<Toggle bind:pressed={underline} aria-label="Underline" variant="outline"
			><Underline class="size-4" /></Toggle
		>
		<span class="ml-auto text-xs text-muted-foreground">Formatting</span>
	</div>
	<div class="space-y-3 p-6">
		<p class="text-xs font-medium text-muted-foreground">LIVE PREVIEW</p>
		<p class="text-2xl leading-relaxed" class:font-bold={bold} class:italic class:underline>
			Make something worth sharing.
		</p>
		<p class="text-sm text-muted-foreground">Combine styles to give your words emphasis.</p>
	</div>
</div>
