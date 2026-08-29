<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-content.svelte';
</script>

<script lang="ts">
	import ItemContent from '#lib/shadcn/ui/item/item-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemContent> = $props();
</script>

<ItemContent {...props} />
