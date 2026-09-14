<script lang="ts">
	import { DataTable, type DataTableColumn } from '#lib/bedrock/ui/data-table';

	type Order = { id: string; number: string; customer: string; status: string; net: number };
	const orders: Order[] = [
		{ id: '1', number: 'PO-1041', customer: 'Northwind', status: 'open', net: 1240.5 },
		{ id: '2', number: 'PO-1042', customer: 'Acme Corp', status: 'delivered', net: 380 },
		{ id: '3', number: 'PO-1043', customer: 'Globex', status: 'open', net: 2118.75 },
		{ id: '4', number: 'PO-1044', customer: 'Initech', status: 'cancelled', net: 96.2 }
	];
	const columns: DataTableColumn<Order>[] = [
		{ key: 'number', header: 'Order', type: 'id' },
		{ key: 'customer', header: 'Customer' },
		{
			key: 'status',
			header: 'Status',
			type: 'badge',
			badgeVariant: (value) =>
				value === 'cancelled' ? 'destructive' : value === 'open' ? 'secondary' : 'default'
		},
		{ key: 'net', header: 'Net', type: 'currency' }
	];
</script>

<DataTable data={orders} {columns} caption="Recent orders" />
