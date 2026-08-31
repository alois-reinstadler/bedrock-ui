<script lang="ts" module>
	export * from '#lib/shadcn/ui/slider/slider.svelte';
</script>

<script lang="ts">
	import Slider from '#lib/shadcn/ui/slider/slider.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...restProps
	}: ComponentProps<typeof Slider> = $props();
</script>

<Slider bind:ref bind:value={value as never} {...restProps} />
