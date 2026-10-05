<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-content.svelte';
</script>

<script lang="ts">
	import { surfacePresence, surfaceInteraction } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import SelectContent from '#lib/shadcn/ui/select/select-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		motion = 'default',
		...restProps
	}: ComponentProps<typeof SelectContent> & { motion?: 'default' | 'soft' } = $props();
</script>

<SelectContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	{@attach surfaceInteraction}
	data-motion-style={motion}
	class={cn('motion-popover', className)}
	{...restProps}
/>
