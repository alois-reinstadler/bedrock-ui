<script lang="ts" module>
	export * from '#lib/shadcn/ui/spinner/spinner.svelte';
</script>

<script lang="ts">
	import { pauseDecorative } from '#lib/bedrock/motion/decorative-visibility.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn } from '#lib/utils.js';
	import Spinner from '#lib/shadcn/ui/spinner/spinner.svelte';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();
	let { class: className, style, ...props }: ComponentProps<typeof Spinner> = $props();
</script>

<Spinner
	{...props}
	class={cn(policy.reduced && 'animate-none', 'motion-reduce:animate-none', className)}
	style={`${style ?? ''}; animation-play-state: var(--bedrock-decorative-play-state, paused); ${policy.reduced ? 'animation: none;' : ''}`}
	{@attach pauseDecorative}
/>
