<script lang="ts">
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
	import { albumMotion } from './motion.js';
	let { delay = 0 }: { delay?: number } = $props();
	let visible = $state(false);
	let reduced = $state(false);
	export function show() {
		visible = true;
	}
	export function reduce() {
		reduced = true;
	}
</script>

<MotionProvider {reduced}>
	{#if visible}
		<div data-testid="album-copy" in:albumMotion={{ duration: 2000, delay }}>Album content</div>
	{/if}
</MotionProvider>
