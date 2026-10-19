<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-separator.svelte';
</script>

<script lang="ts">
	import ItemSeparator from '#lib/shadcn/ui/item/item-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemSeparator> = $props();
</script>

<ItemSeparator bind:ref {...props} />
