<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-ellipsis.svelte';
</script>

<script lang="ts">
	import PaginationEllipsis from '#lib/shadcn/ui/pagination/pagination-ellipsis.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationEllipsis> = $props();
</script>

<PaginationEllipsis {...props} />
