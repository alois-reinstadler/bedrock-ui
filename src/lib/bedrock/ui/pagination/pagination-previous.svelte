<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-previous.svelte';
</script>

<script lang="ts">
	import PaginationPrevious from '#lib/shadcn/ui/pagination/pagination-previous.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationPrevious> = $props();
</script>

<PaginationPrevious {...props} />
