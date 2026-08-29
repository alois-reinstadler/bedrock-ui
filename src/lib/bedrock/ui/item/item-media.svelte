<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-media.svelte';
</script>

<script lang="ts">
	import ItemMedia from '#lib/shadcn/ui/item/item-media.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemMedia> = $props();
</script>

<ItemMedia {...props} />
