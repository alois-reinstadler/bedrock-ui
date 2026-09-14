<script lang="ts">
	import * as Pagination from '#lib/bedrock/ui/pagination';

	let page = $state(2);

	const customers = Array.from({ length: 57 }, (_, index) => ({
		id: index + 1,
		name: `Workspace ${String(index + 1).padStart(2, '0')}`
	}));
	const visible = $derived(customers.slice((page - 1) * 10, page * 10));
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Customer directory</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Page changes update the actual rows and range label, rather than only moving the active page
			marker.
		</p>
	</header>
	<p role="status" class="text-sm text-muted-foreground">
		Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, 57)} of 57 customers
	</p>
	<ul class="grid gap-2 text-sm sm:grid-cols-2">
		{#each visible as customer (customer.id)}<li class="rounded-md border px-3 py-2">
				{customer.name}
			</li>{/each}
	</ul>

	<Pagination.Root count={57} perPage={10} {page} onPageChange={(next) => (page = next)}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item><Pagination.PrevButton /></Pagination.Item>
				{#each pages as item (item.key)}
					{#if item.type === 'ellipsis'}
						<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link page={item} isActive={currentPage === item.value} />
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item><Pagination.NextButton /></Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
</section>
