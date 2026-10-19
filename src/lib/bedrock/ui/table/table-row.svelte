<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-row.svelte';
</script>

<script lang="ts">
	import TableRow from '#lib/shadcn/ui/table/table-row.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof TableRow> = $props();
</script>

<TableRow bind:ref {...props} />
