<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-group.svelte';
</script>

<script lang="ts">
	import ItemGroup from '#lib/shadcn/ui/item/item-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemGroup> = $props();
</script>

<ItemGroup {...props} />
