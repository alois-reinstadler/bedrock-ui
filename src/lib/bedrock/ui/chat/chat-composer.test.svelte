<script lang="ts">
	import Composer from './chat-composer.svelte';

	let busyValue = $state('');
	let pasteValue = $state('');
	let stops = $state(0);
	let pasted = $state<string[]>([]);
</script>

<div id="busy-composer">
	<Composer bind:value={busyValue} busy onStop={() => (stops += 1)}>
		{#snippet drawer()}
			<span data-testid="drawer-chip">draft.pdf</span>
		{/snippet}
	</Composer>
</div>

<div id="paste-composer">
	<Composer
		bind:value={pasteValue}
		onFiles={(files) => (pasted = files.map((file) => file.name))}
	/>
</div>

<output id="stops">{stops}</output>
<output id="pasted">{pasted.join(',')}</output>
