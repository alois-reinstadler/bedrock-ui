<script lang="ts">
	import * as Carousel from '#lib/bedrock/ui/carousel';
</script>

<Carousel.Root class="mx-12 max-w-56">
	<Carousel.Content>
		{#each ['One', 'Two', 'Three', 'Four'] as slide (slide)}
			<Carousel.Item>
				<div
					class="flex h-32 items-center justify-center rounded-lg border bg-muted/40 text-lg font-medium"
				>
					{slide}
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>
