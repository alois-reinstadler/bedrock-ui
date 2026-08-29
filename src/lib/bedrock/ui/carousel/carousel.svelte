<script lang="ts" module>
	export * from '#lib/shadcn/ui/carousel/carousel.svelte';
</script>

<script lang="ts">
	import Carousel from '#lib/shadcn/ui/carousel/carousel.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Carousel> = $props();
</script>

<Carousel {...props} />
