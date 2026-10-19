<script lang="ts" module>
	export * from '#lib/shadcn/ui/sonner/sonner.svelte';
</script>

<script lang="ts">
	import Sonner from '#lib/shadcn/ui/sonner/sonner.svelte';
	import type { ComponentProps } from 'svelte';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { retireToastExits } from './retained-exits.js';
	const policy = useMotionPolicy();

	let props: ComponentProps<typeof Sonner> = $props();
</script>

<div style="display: contents" {@attach policy.attach} {@attach retireToastExits}>
	<Sonner {...props} />
</div>
