<script lang="ts">
	import IconButton from './icon-button.svelte';

	let clicks = $state(0);
</script>

<IconButton icon="search" label="Search records" size="xs" onclick={() => (clicks += 1)} />
<IconButton icon="add" label="Add record" size="lg" tooltip="Add a record" />
<output aria-label="Click count">{clicks}</output>
