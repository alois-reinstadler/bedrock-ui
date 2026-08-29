<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-header.svelte';
</script>

<script lang="ts">
	import ItemHeader from '#lib/shadcn/ui/item/item-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemHeader> = $props();
</script>

<ItemHeader {...props} />
