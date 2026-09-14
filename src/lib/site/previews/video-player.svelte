<script lang="ts">
	import { VideoPlayer } from '#lib/bedrock/ui/video-player';
</script>

<div class="max-w-xl">
	<VideoPlayer
		src="/demo/clip.mp4"
		label="Test pattern clip"
		captions={[{ src: '/demo/clip.en.vtt', srclang: 'en', label: 'English' }]}
	/>
	<p class="mt-2 text-sm text-muted-foreground">
		Space/K play, arrows seek, M mute, C captions, F full screen.
	</p>
</div>
