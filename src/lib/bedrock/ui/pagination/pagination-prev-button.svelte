<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-prev-button.svelte';
</script>

<script lang="ts">
	import PaginationPrevButton from '#lib/shadcn/ui/pagination/pagination-prev-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationPrevButton> = $props();
</script>

<PaginationPrevButton {...props} />
