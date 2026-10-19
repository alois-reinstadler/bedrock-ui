<script lang="ts">
	import { Shape01, Shape08, Shape15, Shape28, Shape45, Shape64 } from '#lib/bedrock/ui/shapes';
</script>

<div class="grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
	<div class="shape-tile"><Shape01 /></div>
	<div class="shape-tile"><Shape08 /></div>
	<div class="shape-tile"><Shape15 /></div>
	<div class="shape-tile"><Shape28 /></div>
	<div class="shape-tile"><Shape45 /></div>
	<div class="shape-tile"><Shape64 /></div>
</div>

<style>
	.shape-tile {
		display: flex;
		aspect-ratio: 1;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 1rem;
	}
	.shape-tile :global(svg) {
		width: 100%;
		height: auto;
	}
</style>
