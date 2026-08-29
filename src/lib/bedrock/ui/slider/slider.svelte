<script lang="ts" module>
	export * from '#lib/shadcn/ui/slider/slider.svelte';
</script>

<script lang="ts">
	import Slider from '#lib/shadcn/ui/slider/slider.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Slider> = $props();
</script>

<Slider {...props} />
