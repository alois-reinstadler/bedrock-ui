<script lang="ts">
	import ComplexSelector from './complex-selector.svelte';

	let value = $state<number | undefined>(undefined);
</script>

<ComplexSelector bind:value placeholder="Threshold">
	{#snippet content({ value: current, commit, close })}
		<div class="flex flex-col gap-2">
			<output aria-label="Draft">{current ?? 'none'}</output>
			<button type="button" onclick={() => commit(42)}>Commit 42</button>
			<button type="button" onclick={close}>Close</button>
		</div>
	{/snippet}
</ComplexSelector>
<output aria-label="Value">{value ?? 'none'}</output>
