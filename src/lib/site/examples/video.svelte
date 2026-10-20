<script lang="ts">
	import { Video } from '#lib/bedrock/ui/video';
	import { Button } from '#lib/bedrock/ui/button';
	let version = $state(0);
</script>

<section class="w-full max-w-xl space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Keep the page steady while videos load</h3>
		<p class="text-sm text-muted-foreground">
			This demo holds the skeleton for at least 1.2 seconds, then reveals the first frame and native
			controls. Reload to replay the loading state.
		</p>
	</div>
	<figure class="space-y-3">
		<Video
			src={`/demo/clip.mp4?version=${version}`}
			label="Sample video with loading skeleton"
			width={640}
			height={360}
			minimumLoadingDuration={1200}
			captions={[{ src: '/demo/clip.en.vtt', srclang: 'en', label: 'English' }]}
			class="rounded-xl"
		/>
		<figcaption class="text-sm text-muted-foreground">
			A short local test clip. Press play when you’re ready.
		</figcaption>
	</figure>
	<Button variant="outline" onclick={() => version++}>Reload video</Button>
</section>
