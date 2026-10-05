<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item.svelte';
</script>

<script lang="ts">
	import Item from '#lib/shadcn/ui/item/item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Item> = $props();
</script>

<Item bind:ref {...props} />
