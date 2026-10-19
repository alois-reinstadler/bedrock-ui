<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-actions.svelte';
</script>

<script lang="ts">
	import ItemActions from '#lib/shadcn/ui/item/item-actions.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemActions> = $props();
</script>

<ItemActions bind:ref {...props} />
