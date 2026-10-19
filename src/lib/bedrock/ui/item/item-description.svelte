<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-description.svelte';
</script>

<script lang="ts">
	import ItemDescription from '#lib/shadcn/ui/item/item-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemDescription> = $props();
</script>

<ItemDescription bind:ref {...props} />
