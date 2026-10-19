<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-media.svelte';
</script>

<script lang="ts">
	import ItemMedia from '#lib/shadcn/ui/item/item-media.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ItemMedia> = $props();
</script>

<ItemMedia bind:ref {...props} />
