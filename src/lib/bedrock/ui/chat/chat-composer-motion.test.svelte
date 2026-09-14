<script lang="ts">
	import '../../../../routes/layout.css';
	import Composer from './chat-composer.svelte';
	let busy = $state(false);
</script>

<button onclick={() => (busy = !busy)}>Toggle busy</button>
<Composer {busy} value="A message" />
