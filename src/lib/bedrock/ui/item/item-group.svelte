<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-group.svelte';
</script>

<script lang="ts">
	import ItemGroup from '#lib/shadcn/ui/item/item-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemGroup> = $props();
</script>

<ItemGroup bind:ref {...props} />
