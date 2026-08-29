<script lang="ts" module>
	export * from '#lib/shadcn/ui/carousel/carousel-next.svelte';
</script>

<script lang="ts">
	import CarouselNext from '#lib/shadcn/ui/carousel/carousel-next.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CarouselNext> = $props();
</script>

<CarouselNext {...props} />
