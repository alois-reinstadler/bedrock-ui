<script lang="ts">
	import DataTable from './data-table.svelte';
	import type { DataTableColumn, DataTableView } from './types.js';

	type Row = { id: string; customer: string; status: string; amount: number };
	const data: Row[] = [
		{ id: 'A-1', customer: 'Alpen AG', status: 'offen', amount: 10 },
		{ id: 'A-2', customer: 'Alpen AG', status: 'fertig', amount: 20 },
		{ id: 'B-1', customer: 'Berg KG', status: 'offen', amount: 30 }
	];
	const columns: DataTableColumn<Row>[] = [
		{ key: 'id', header: 'ID', type: 'id' },
		{ key: 'customer', header: 'Kunde' },
		{ key: 'status', header: 'Status', type: 'badge', badgeVariant: () => 'secondary' },
		{ key: 'amount', header: 'Betrag', type: 'currency' }
	];
	const views: DataTableView<Row>[] = [
		{ key: 'open', label: 'Offen', filter: (row) => row.status === 'offen' },
		{ key: 'empty', label: 'Leer', filter: () => false }
	];
</script>

<DataTable {data} {columns} {views} groupable={['customer']} selectable pageSize={10} />
