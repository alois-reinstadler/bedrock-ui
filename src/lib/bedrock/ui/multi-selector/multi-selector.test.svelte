<script lang="ts">
	import type { SelectorItem } from '#lib/bedrock/ui/selector';
	import MultiSelector from './multi-selector.svelte';

	let {
		triggerDisplay = 'count',
		selectAll = false,
		maxBadges = 3,
		initial = []
	}: {
		triggerDisplay?: 'count' | 'labels' | 'badges';
		selectAll?: boolean;
		maxBadges?: number;
		initial?: string[];
	} = $props();

	// svelte-ignore state_referenced_locally (fixture captures the initial value on purpose)
	let value = $state<string[]>(initial);

	const items: SelectorItem[] = [
		{ value: 'red', label: 'Red' },
		{ value: 'green', label: 'Green' },
		{ value: 'blue', label: 'Blue' },
		{ value: 'gray', label: 'Gray', disabled: true }
	];
</script>

<MultiSelector {items} bind:value {triggerDisplay} {selectAll} {maxBadges} placeholder="Colors" />
<output aria-label="Value">{value.join(',')}</output>
