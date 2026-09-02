<script lang="ts">
	import SelectableCard from './selectable-card.svelte';

	let {
		disabled = false,
		onSelectedChange
	}: {
		disabled?: boolean;
		onSelectedChange?: (selected: boolean) => void;
	} = $props();

	let selected = $state(false);
</script>

<SelectableCard label="Select shift report" bind:selected {disabled} {onSelectedChange}>
	<p class="p-4">Report body</p>
</SelectableCard>
<output data-testid="bound-value">{selected}</output>
