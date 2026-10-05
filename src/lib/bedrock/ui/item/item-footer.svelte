<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-footer.svelte';
</script>

<script lang="ts">
	import ItemFooter from '#lib/shadcn/ui/item/item-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemFooter> = $props();
</script>

<ItemFooter bind:ref {...props} />
