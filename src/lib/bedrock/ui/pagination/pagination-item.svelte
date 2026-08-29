<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-item.svelte';
</script>

<script lang="ts">
	import PaginationItem from '#lib/shadcn/ui/pagination/pagination-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationItem> = $props();
</script>

<PaginationItem {...props} />
