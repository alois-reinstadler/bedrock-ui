<script lang="ts">
	import { VideoPlayer } from '#lib/bedrock/ui/video-player';
	import { Button } from '#lib/bedrock/ui/button';
	let complete = $state(false);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Watch a training lesson</h3>
		<p class="text-sm text-muted-foreground">
			Play the local sample clip with captions. Playback controls stay available to both pointer and
			keyboard users.
		</p>
	</div>

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
	<div class="flex flex-wrap items-center gap-3">
		<Button variant="outline" onclick={() => (complete = !complete)}
			>{complete ? 'Mark as incomplete' : 'Mark lesson complete'}</Button
		>
		<p role="status" class="text-sm">
			{complete ? 'Lesson 1 of 4 completed.' : 'Lesson 1 of 4 · Player controls'}
		</p>
	</div>
</section>
