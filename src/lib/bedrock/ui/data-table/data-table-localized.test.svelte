<script lang="ts">
	import DataTable, { type DataTableLabels } from './data-table.svelte';
	import type { DataTableColumn } from './types.js';

	type Row = { id: string; amount: number };
	const data: Row[] = [{ id: 'A-1', amount: 1234.5 }];
	const columns: DataTableColumn<Row>[] = [
		{ key: 'id', header: 'ID', type: 'id' },
		{ key: 'amount', header: 'Betrag', type: 'currency' }
	];
	const labels: DataTableLabels = { searchPlaceholder: 'Suchen…' };
</script>

<DataTable {data} {columns} {labels} locale="de-AT" searchable />
