<script lang="ts">
	import type { Snippet } from 'svelte';
	import { MotionConfig } from 'astra-motion';
	import { useMotionPolicy } from './policy.svelte.js';

	let { children }: { children: Snippet } = $props();
	const policy = useMotionPolicy();
</script>

<MotionConfig
	reducedMotion={policy.reduced ? 'always' : 'user'}
	transition={policy.reduced ? { duration: 0, delay: 0 } : undefined}
	layoutTransition={policy.reduced ? { duration: 0, delay: 0 } : undefined}
>
	{@render children()}
</MotionConfig>
