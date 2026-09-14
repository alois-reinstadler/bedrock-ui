<script lang="ts">
	import {
		applyPowerSearchFilters,
		PowerSearch,
		type PowerSearchConfig,
		type PowerSearchFilter
	} from '#lib/bedrock/ui/power-search';

	type Order = {
		id: string;
		customer: string;
		status: string;
		total: number;
		tags: string[];
		placed: string;
	};

	const orders: Order[] = [
		{
			id: 'ORD-1042',
			customer: 'Alpine Trading',
			status: 'open',
			total: 1280,
			tags: ['rush'],
			placed: '2026-08-04'
		},
		{
			id: 'ORD-1043',
			customer: 'Borealis GmbH',
			status: 'paid',
			total: 460,
			tags: ['export', 'b2b'],
			placed: '2026-08-11'
		},
		{
			id: 'ORD-1044',
			customer: 'Cirrus Ltd',
			status: 'open',
			total: 2150,
			tags: ['b2b'],
			placed: '2026-08-18'
		},
		{
			id: 'ORD-1045',
			customer: 'Dune Works',
			status: 'void',
			total: 90,
			tags: [],
			placed: '2026-08-21'
		},
		{
			id: 'ORD-1046',
			customer: 'Alpine Trading',
			status: 'paid',
			total: 770,
			tags: ['rush', 'export'],
			placed: '2026-08-27'
		}
	];

	const config: PowerSearchConfig = {
		fields: [
			{ key: 'customer', label: 'Customer', type: 'string' },
			{
				key: 'status',
				label: 'Status',
				type: 'enum',
				values: [
					{ value: 'open', label: 'Open' },
					{ value: 'paid', label: 'Paid' },
					{ value: 'void', label: 'Void' }
				]
			},
			{
				key: 'tags',
				label: 'Tags',
				type: 'enumList',
				values: [
					{ value: 'rush', label: 'Rush' },
					{ value: 'export', label: 'Export' },
					{ value: 'b2b', label: 'B2B' }
				]
			},
			{ key: 'total', label: 'Total', type: 'number' },
			{ key: 'placed', label: 'Placed', type: 'date' }
		],
		freeTextField: 'customer'
	};

	let filters = $state<PowerSearchFilter[]>([]);
	const visible = $derived(applyPowerSearchFilters(filters, orders));
	const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' });
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Orders requiring attention</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Combine customer search with structured status, date, and total filters. The result list uses
			the same filter expression as the search summary.
		</p>
	</header>

	<div class="flex w-full max-w-xl flex-col gap-3">
		<PowerSearch {config} bind:filters resultCount={visible.length} placeholder="Filter orders…" />
		<ul class="flex flex-col gap-1 text-sm">
			{#each visible as order (order.id)}
				<li class="flex items-center gap-3 rounded-md border px-3 py-1.5">
					<span class="font-code text-xs text-muted-foreground">{order.id}</span>
					<span class="flex-1 truncate">{order.customer}</span>
					<span class="text-xs text-muted-foreground capitalize">{order.status}</span>
					<span class="tabular-nums">{currency.format(order.total)}</span>
				</li>
			{:else}
				<li class="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground">
					No matching orders.
				</li>
			{/each}
		</ul>
	</div>
</section>
