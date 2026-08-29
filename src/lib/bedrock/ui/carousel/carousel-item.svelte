<script lang="ts" module>
	export * from '#lib/shadcn/ui/carousel/carousel-item.svelte';
</script>

<script lang="ts">
	import CarouselItem from '#lib/shadcn/ui/carousel/carousel-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CarouselItem> = $props();
</script>

<CarouselItem {...props} />
