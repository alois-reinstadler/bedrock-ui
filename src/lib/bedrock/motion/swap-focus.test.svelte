<script lang="ts">
	import Swap from './swap.svelte';
	let { value = 0 }: { value?: number } = $props();
</script>

<button type="button" data-outside>Outside</button>
<Swap key={value}>
	<button type="button" data-current={value}>Action {value}</button>
</Swap>
