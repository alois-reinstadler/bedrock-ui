<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-footer.svelte';
</script>

<script lang="ts">
	import ItemFooter from '#lib/shadcn/ui/item/item-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemFooter> = $props();
</script>

<ItemFooter {...props} />
