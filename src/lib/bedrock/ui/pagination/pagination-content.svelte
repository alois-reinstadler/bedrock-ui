<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-content.svelte';
</script>

<script lang="ts">
	import PaginationContent from '#lib/shadcn/ui/pagination/pagination-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationContent> = $props();
</script>

<PaginationContent {...props} />
