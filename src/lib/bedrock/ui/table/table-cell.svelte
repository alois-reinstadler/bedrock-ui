<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-cell.svelte';
</script>

<script lang="ts">
	import TableCell from '#lib/shadcn/ui/table/table-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableCell> = $props();
</script>

<TableCell {...props} />
