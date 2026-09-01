<script lang="ts">
	import Token from './token.svelte';

	let bodyClicks = $state(0);
	let removals = $state(0);
</script>

<Token label="Plain token" />
<Token label="Clickable token" color="blue" size="sm" onclick={() => (bodyClicks += 1)} />
<Token label="Linked token" href="/records" />
<Token label="Removable token" onRemove={() => (removals += 1)} />
<Token
	label="Disabled token"
	href="/disabled"
	onclick={() => (bodyClicks += 1)}
	onRemove={() => (removals += 1)}
	disabled
/>
<output aria-label="Body clicks">{bodyClicks}</output>
<output aria-label="Removals">{removals}</output>
