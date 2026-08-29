<script lang="ts" module>
	export * from '#lib/shadcn/ui/scroll-area/scroll-area.svelte';
</script>

<script lang="ts">
	import ScrollArea from '#lib/shadcn/ui/scroll-area/scroll-area.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ScrollArea> = $props();
</script>

<ScrollArea {...props} />
