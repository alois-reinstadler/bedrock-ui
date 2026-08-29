<script lang="ts" module>
	export * from '#lib/shadcn/ui/pagination/pagination.svelte';
</script>

<script lang="ts">
	import Pagination from '#lib/shadcn/ui/pagination/pagination.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Pagination> = $props();
</script>

<Pagination {...props} />
