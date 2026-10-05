<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
</script>

<script lang="ts">
	import { surfaceInteraction, surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import ContextMenuContent from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		motion = 'default',
		...restProps
	}: ComponentProps<typeof ContextMenuContent> & {
		/** Optional expressive entry; labels never stagger. */ motion?: 'default' | 'soft' | 'stagger';
	} = $props();
</script>

<ContextMenuContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	{@attach surfaceInteraction}
	data-motion-style={motion}
	class={cn('motion-popover', className)}
	{...restProps}
/>
