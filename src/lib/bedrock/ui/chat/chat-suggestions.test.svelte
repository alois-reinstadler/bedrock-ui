<script lang="ts">
	import Suggestions from './chat-suggestions.svelte';

	let selected = $state('');
	const items = ['Summarize the report', 'Draft an update'];
</script>

<Suggestions {items} onSelect={(item) => (selected = item)} />
<output id="selected">{selected}</output>
