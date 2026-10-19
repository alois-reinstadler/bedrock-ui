<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination.svelte';
</script>

<script lang="ts">
	import Pagination from '#lib/shadcn/ui/pagination/pagination.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		page = $bindable(1),
		...props
	}: ComponentProps<typeof Pagination> = $props();
</script>

<Pagination bind:ref bind:page {...props} />
