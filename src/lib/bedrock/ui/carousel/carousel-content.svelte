<script lang="ts" module>
	export * from '#lib/shadcn/ui/carousel/carousel-content.svelte';
</script>

<script lang="ts">
	import CarouselContent from '#lib/shadcn/ui/carousel/carousel-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CarouselContent> = $props();
</script>

<CarouselContent {...props} />
