<script lang="ts">
	import Selector from './selector.svelte';
	import type { SelectorItem } from './types.js';

	let {
		searchable = false,
		clearable = false,
		custom = false,
		initial = ''
	}: { searchable?: boolean; clearable?: boolean; custom?: boolean; initial?: string } = $props();

	// svelte-ignore state_referenced_locally (fixture captures the initial value on purpose)
	let value = $state(initial);

	const items: SelectorItem[] = [
		{
			type: 'group',
			label: 'Fruits',
			items: [
				{ value: 'apple', label: 'Apple', description: 'Crisp and sweet' },
				{ value: 'banana', label: 'Banana' }
			]
		},
		{ type: 'separator' },
		{ value: 'carrot', label: 'Carrot' },
		{ value: 'durian', label: 'Durian', disabled: true }
	];
</script>

{#if custom}
	<Selector {items} bind:value {searchable} {clearable} placeholder="Pick one">
		{#snippet option(entry)}
			<span data-testid="custom-option">*{entry.label}*</span>
		{/snippet}
	</Selector>
{:else}
	<Selector {items} bind:value {searchable} {clearable} placeholder="Pick one" />
{/if}
<output aria-label="Value">{value}</output>
