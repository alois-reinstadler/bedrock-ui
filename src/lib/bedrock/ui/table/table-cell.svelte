<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-cell.svelte';
</script>

<script lang="ts">
	import TableCell from '#lib/shadcn/ui/table/table-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof TableCell> = $props();
</script>

<TableCell bind:ref {...props} />
