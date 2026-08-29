<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination-next-button.svelte';
</script>

<script lang="ts">
	import PaginationNextButton from '#lib/shadcn/ui/pagination/pagination-next-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PaginationNextButton> = $props();
</script>

<PaginationNextButton {...props} />
