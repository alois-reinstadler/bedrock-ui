<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	let {
		query = $bindable(''),
		resultCount,
		filters = [],
		activeFilters = $bindable([]),
		actions
	}: {
		query?: string;
		resultCount: number;
		filters?: { id: string; label: string }[];
		activeFilters?: string[];
		actions?: Snippet;
	} = $props();
	const id = $props.id();
	function toggle(id: string) {
		activeFilters = activeFilters.includes(id)
			? activeFilters.filter((value) => value !== id)
			: [...activeFilters, id];
	}
</script>

<div class="space-y-3 rounded-xl border bg-card p-4">
	<div class="flex flex-wrap items-end gap-3">
		<label for={id} class="min-w-40 flex-1 space-y-1 text-sm font-medium"
			>Search collection<Input
				{id}
				type="search"
				value={query}
				oninput={(event) => (query = event.currentTarget.value)}
				placeholder="Search by name"
			/></label
		>
		<div class="flex flex-wrap gap-2">
			{#each filters as filter (filter.id)}<Button
					variant={activeFilters.includes(filter.id) ? 'secondary' : 'outline'}
					aria-pressed={activeFilters.includes(filter.id)}
					onclick={() => toggle(filter.id)}>{filter.label}</Button
				>{/each}{@render actions?.()}
		</div>
	</div>
	<p role="status" class="text-sm text-muted-foreground">
		{resultCount}
		{resultCount === 1 ? 'result' : 'results'}{activeFilters.length
			? ` · ${activeFilters.length} active filters`
			: ''}
	</p>
</div>
