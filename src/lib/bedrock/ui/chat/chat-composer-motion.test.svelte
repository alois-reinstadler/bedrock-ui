<script lang="ts">
	import Composer from './chat-composer.svelte';
	let busy = $state(false);
</script>

<button onclick={() => (busy = !busy)}>Toggle busy</button>
<Composer {busy} value="A message" />
