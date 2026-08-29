<script lang="ts" module>
	export * from '#lib/shadcn/ui/item/item-title.svelte';
</script>

<script lang="ts">
	import ItemTitle from '#lib/shadcn/ui/item/item-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ItemTitle> = $props();
</script>

<ItemTitle {...props} />
