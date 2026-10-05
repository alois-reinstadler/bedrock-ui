<script lang="ts" module>
	export * from '#lib/shadcn/ui/hover-card/hover-card.svelte';
</script>

<script lang="ts">
	import HoverCard from '#lib/shadcn/ui/hover-card/hover-card.svelte';
	import type { ComponentProps } from 'svelte';

	let { open = $bindable(false), ...props }: ComponentProps<typeof HoverCard> = $props();
</script>

<HoverCard bind:open {...props} />
