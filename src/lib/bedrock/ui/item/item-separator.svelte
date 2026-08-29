<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-separator.svelte';
</script>

<script lang="ts">
	import ItemSeparator from '#lib/shadcn/ui/item/item-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemSeparator> = $props();
</script>

<ItemSeparator {...props} />
