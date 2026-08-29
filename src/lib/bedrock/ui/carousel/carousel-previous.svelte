<script lang="ts" module>
	export * from '#lib/shadcn/ui/carousel/carousel-previous.svelte';
</script>

<script lang="ts">
	import CarouselPrevious from '#lib/shadcn/ui/carousel/carousel-previous.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CarouselPrevious> = $props();
</script>

<CarouselPrevious {...props} />
