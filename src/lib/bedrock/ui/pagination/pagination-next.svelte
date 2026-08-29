<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-next.svelte';
</script>

<script lang="ts">
	import PaginationNext from '#lib/shadcn/ui/pagination/pagination-next.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationNext> = $props();
</script>

<PaginationNext {...props} />
