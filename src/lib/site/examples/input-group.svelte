<script lang="ts">
	import * as InputGroup from '#lib/bedrock/ui/input-group';
	import { Icon } from '#lib/bedrock/ui/icon';

	let query = $state('');
	const orders = ['ORD-204 · Studio North', 'ORD-205 · Field Office', 'ORD-206 · Studio South'];
	const matches = $derived(
		orders.filter((order) => order.toLowerCase().includes(query.toLowerCase()))
	);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Order lookup</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			An inline search icon establishes purpose; the visible result list makes the filtering
			behavior clear.
		</p>
	</header>

	<div class="grid max-w-sm gap-3">
		<InputGroup.Root>
			<InputGroup.Addon><Icon icon="search" /></InputGroup.Addon>
			<InputGroup.Input
				placeholder="Search orders…"
				aria-label="Search orders"
				value={query}
				oninput={(e) => (query = e.currentTarget.value)}
			/>
		</InputGroup.Root>
	</div>
	<ul class="divide-y text-sm">
		{#each matches as order (order)}<li class="py-3">{order}</li>{:else}<li
				class="py-3 text-muted-foreground"
			>
				No orders match. Try Studio.
			</li>{/each}
	</ul>
	<p role="status" class="text-xs text-muted-foreground">{matches.length} matching orders</p>
</section>
