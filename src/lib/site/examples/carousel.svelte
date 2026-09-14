<script lang="ts">
	import * as Carousel from '#lib/bedrock/ui/carousel';
	import { Button } from '#lib/bedrock/ui/button';
	let selected = $state('');
	const tracks = [
		{
			title: 'Observe',
			summary: 'Build a field notebook from everyday details.',
			time: '09:00 · 45 minutes'
		},
		{
			title: 'Sketch',
			summary: 'Turn observations into quick interface ideas.',
			time: '10:00 · 60 minutes'
		},
		{
			title: 'Share',
			summary: 'Present one idea and collect useful feedback.',
			time: '11:15 · 45 minutes'
		}
	];
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Choose a workshop track</h3>
		<p class="text-sm text-muted-foreground">
			Each slide carries a real decision. Previous and next controls remain available beside swipe
			gestures.
		</p>
	</header>
	<Carousel.Root class="mx-12 max-w-md"
		><Carousel.Content
			>{#each tracks as track (track.title)}<Carousel.Item
					><div class="space-y-4 rounded-xl border bg-card p-5">
						<p class="text-xs text-muted-foreground">{track.time}</p>
						<h4 class="text-xl font-semibold">{track.title}</h4>
						<p class="min-h-12 text-sm">{track.summary}</p>
						<Button
							size="sm"
							variant={selected === track.title ? 'secondary' : 'outline'}
							onclick={() => (selected = track.title)}
							>{selected === track.title ? 'Added to your day' : 'Choose track'}</Button
						>
					</div></Carousel.Item
				>{/each}</Carousel.Content
		><Carousel.Previous /><Carousel.Next /></Carousel.Root
	>
	<p role="status" class="text-sm text-muted-foreground">
		{selected
			? `${selected} is selected for your workshop day.`
			: 'Choose one track to plan your day.'}
	</p>
</section>
