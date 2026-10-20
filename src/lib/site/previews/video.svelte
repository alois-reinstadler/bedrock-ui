<script lang="ts">
	import { Video } from '#lib/bedrock/ui/video';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div class="space-y-2">
		<Video
			src="/demo/clip.mp4"
			label="Load the sample clip on demand"
			preload="none"
			captions={[{ src: '/demo/clip.en.vtt', srclang: 'en', label: 'English' }]}
		/>
		<p class="text-sm text-muted-foreground">Load on demand, then use native playback controls</p>
	</div>
	<div class="space-y-2">
		<Video label="Unavailable video preview">
			{#snippet fallback()}<span>No video available</span>{/snippet}
		</Video>
		<p class="text-sm text-muted-foreground">Custom fallback</p>
	</div>
</div>
