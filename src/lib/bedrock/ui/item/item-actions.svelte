<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-actions.svelte';
</script>

<script lang="ts">
	import ItemActions from '#lib/shadcn/ui/item/item-actions.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemActions> = $props();
</script>

<ItemActions {...props} />
