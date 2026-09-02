<script lang="ts">
	import Reasoning from './chat-reasoning.svelte';
</script>

<Reasoning id="idle" label="Reasoning">
	<p>Chain of thought</p>
</Reasoning>

<Reasoning id="busy" label="Thinking" working>
	<p>Working notes</p>
</Reasoning>
