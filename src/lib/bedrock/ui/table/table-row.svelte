<script lang="ts" module>
	export * from '#lib/shadcn/ui/table/table-row.svelte';
</script>

<script lang="ts">
	import TableRow from '#lib/shadcn/ui/table/table-row.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof TableRow> = $props();
</script>

<TableRow {...props} />
