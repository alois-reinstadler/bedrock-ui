<script lang="ts">
	import { Token } from '#lib/bedrock/ui/token';

	let removed = $state(false);
</script>

<div class="flex flex-wrap items-center gap-2">
	<Token label="Alpine soil" icon="attachment" />
	<Token label="Ready" color="green" onclick={() => undefined} />
	<Token label="Sample details" color="blue" href="/docs/components" />
	{#if !removed}<Token label="Draft" color="orange" onRemove={() => (removed = true)} />{/if}
</div>
