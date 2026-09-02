<script lang="ts">
	import PowerSearch from './power-search.svelte';
	import type { PowerSearchConfig, PowerSearchFilter } from './types.js';

	let {
		initial = [],
		resultCount = undefined,
		freeText = false
	}: {
		initial?: PowerSearchFilter[];
		resultCount?: number;
		freeText?: boolean;
	} = $props();

	// svelte-ignore state_referenced_locally (fixture captures the initial value on purpose)
	let filters = $state<PowerSearchFilter[]>(initial);
	let lastChange = $state('');

	const config: PowerSearchConfig = $derived({
		fields: [
			{ key: 'customer', label: 'Customer', type: 'string' },
			{ key: 'total', label: 'Total', type: 'number' },
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
			{ key: 'placed', label: 'Placed', type: 'date' }
		],
		freeTextField: freeText ? 'customer' : undefined
	});
</script>

<PowerSearch
	{config}
	bind:filters
	{resultCount}
	onFiltersChange={(_, change) => (lastChange = `${change.type}:${change.index}`)}
/>
<output aria-label="Filters">{JSON.stringify(filters)}</output>
<output aria-label="Change">{lastChange}</output>
