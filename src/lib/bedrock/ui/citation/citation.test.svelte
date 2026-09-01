<script lang="ts">
	import Citation from './citation.svelte';
</script>

<Citation number={1} source={{ title: 'Linked source', url: 'https://example.com' }} />
<Citation number={2} source={{ title: 'Plain source' }} />
<Citation number={3} source={{ title: 'Numeric source' }} variant="number" />
