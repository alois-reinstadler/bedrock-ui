<script lang="ts">
	import * as Pagination from '#lib/bedrock/ui/pagination';

	let page = $state(2);
</script>

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
