<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-content.svelte';
</script>

<script lang="ts">
	import ItemContent from '#lib/shadcn/ui/item/item-content.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemContent> = $props();
</script>

<ItemContent bind:ref {...props} />
