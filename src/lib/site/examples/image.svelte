<script lang="ts">
	import { Image } from '#lib/bedrock/ui/image';
	import { Button } from '#lib/bedrock/ui/button';

	let version = $state(0);
</script>

<section class="w-full max-w-xl space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Keep the page steady while images load</h3>
		<p class="text-sm text-muted-foreground">
			This demo simulates a 1.2-second load so you can see the skeleton and image reveal. Reload to
			replay it, even with a cached image.
		</p>
	</div>
	<figure class="space-y-3">
		<Image
			src={`/demo/landscape.svg?version=${version}`}
			alt="Layered green mountains and a pale sun in a muted sky"
			width={1600}
			height={900}
			loading="lazy"
			minimumLoadingDuration={1200}
			class="rounded-xl"
		/>
		<figcaption class="text-sm text-muted-foreground">
			A quiet view across the ridgeline.
		</figcaption>
	</figure>
	<Button variant="outline" onclick={() => version++}>Reload image</Button>
</section>
