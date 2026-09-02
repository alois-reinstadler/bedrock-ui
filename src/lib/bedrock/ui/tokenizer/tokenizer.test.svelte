<script lang="ts">
	import type { SelectorOption } from '#lib/bedrock/ui/selector';
	import Tokenizer from './tokenizer.svelte';

	let {
		create = false,
		maxItems = undefined,
		useOptions = true,
		initial = []
	}: {
		create?: boolean;
		maxItems?: number;
		useOptions?: boolean;
		initial?: string[];
	} = $props();

	// svelte-ignore state_referenced_locally (fixture captures the initial value on purpose)
	let value = $state<string[]>(initial);
	let lastChange = $state('');

	const options: SelectorOption[] = $derived(
		useOptions
			? [
					{ value: 'ada', label: 'Ada Lovelace' },
					{ value: 'grace', label: 'Grace Hopper' },
					{ value: 'edsger', label: 'Edsger Dijkstra' }
				]
			: []
	);
</script>

<Tokenizer
	{options}
	bind:value
	{create}
	{maxItems}
	placeholder="Add…"
	onValueChange={(_, change) => (lastChange = `${change.type}:${change.value}`)}
/>
<output aria-label="Value">{value.join(',')}</output>
<output aria-label="Change">{lastChange}</output>
