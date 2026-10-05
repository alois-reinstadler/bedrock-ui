<script lang="ts">
	import { Image } from '#lib/bedrock/ui/image';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="space-y-2">
		<Image
			src="/demo/landscape.svg"
			alt="Green mountain ridges beneath a pale sun"
			width={1600}
			height={900}
			minimumLoadingDuration={1200}
		/>
		<p class="text-sm text-muted-foreground">Simulated 1.2-second load, then a soft reveal</p>
	</div>
	<div class="space-y-2">
		<Image alt="Mountain landscape unavailable" aspectRatio={16 / 9}>
			{#snippet fallback()}
				<span>No preview available</span>
			{/snippet}
		</Image>
		<p class="text-sm text-muted-foreground">Custom fallback</p>
	</div>
</div>
