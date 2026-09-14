<script lang="ts">
	import { DataTable, type DataTableColumn } from '#lib/bedrock/ui/data-table';

	type Order = { id: string; number: string; customer: string; status: string; net: number };
	const orders: Order[] = [
		{ id: '1', number: 'PO-1041', customer: 'Fieldwork Studio', status: 'open', net: 1240.5 },
		{ id: '2', number: 'PO-1042', customer: 'Juniper Workshop', status: 'delivered', net: 380 },
		{ id: '3', number: 'PO-1043', customer: 'Meadow Press', status: 'open', net: 2118.75 },
		{ id: '4', number: 'PO-1044', customer: 'Stillwater Lab', status: 'cancelled', net: 96.2 }
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

	import { Button } from '#lib/bedrock/ui/button';
	let onlyOpen = $state(false);
	const visibleOrders = $derived(
		onlyOpen ? orders.filter((order) => order.status === 'open') : orders
	);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Review recent purchase orders</h3>
		<p class="text-sm text-muted-foreground">
			Filter the order queue before reviewing amounts and status. Status labels remain
			understandable without color.
		</p>
	</header>
	<div class="flex items-center justify-between gap-3">
		<p class="text-sm text-muted-foreground">{visibleOrders.length} orders</p>
		<Button
			variant="outline"
			size="sm"
			aria-pressed={onlyOpen}
			onclick={() => (onlyOpen = !onlyOpen)}
			>{onlyOpen ? 'Show all orders' : 'Show open orders'}</Button
		>
	</div>

	<DataTable data={visibleOrders} {columns} caption="Recent orders" />
</section>
