<script lang="ts">
	import type { Snippet } from 'svelte';
	import { provideMotionPolicy } from './policy.svelte.js';

	let { reduced = false, children }: { reduced?: boolean; children: Snippet } = $props();
	const policy = provideMotionPolicy(() => reduced);
</script>

<div style="display: contents" data-bedrock-motion={policy.reduced ? 'reduced' : 'full'}>
	{@render children()}
</div>
