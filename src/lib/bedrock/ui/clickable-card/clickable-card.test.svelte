<script lang="ts">
	import ClickableCard from './clickable-card.svelte';

	let {
		href,
		disabled = false,
		oncard,
		onnested
	}: {
		href?: string;
		disabled?: boolean;
		oncard?: (event: MouseEvent) => void;
		onnested?: (event: MouseEvent) => void;
	} = $props();
</script>

<ClickableCard label="Open shift report" {href} {disabled} onclick={oncard}>
	<div class="p-4">
		<p>Report body</p>
		<button type="button" onclick={onnested}>Nested action</button>
	</div>
</ClickableCard>
