<script lang="ts" module>
	export * from '#lib/shadcn/ui/scroll-area/scroll-area-scrollbar.svelte';
</script>

<script lang="ts">
	import ScrollAreaScrollbar from '#lib/shadcn/ui/scroll-area/scroll-area-scrollbar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ScrollAreaScrollbar> = $props();
</script>

<ScrollAreaScrollbar {...props} />
