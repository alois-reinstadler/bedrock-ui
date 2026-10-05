<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-link.svelte';
</script>

<script lang="ts">
	import PaginationLink from '#lib/shadcn/ui/pagination/pagination-link.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof PaginationLink> = $props();
</script>

<PaginationLink bind:ref {...props} />
