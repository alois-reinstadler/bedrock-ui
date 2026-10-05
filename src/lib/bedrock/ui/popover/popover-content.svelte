<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-content.svelte';
</script>

<script lang="ts">
	import { surfaceInteraction, surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import PopoverContent from '#lib/shadcn/ui/popover/popover-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		motion = 'default',
		...restProps
	}: ComponentProps<typeof PopoverContent> & {
		/** Optional expressive entry; labels never stagger. */ motion?: 'default' | 'soft';
	} = $props();
</script>

<PopoverContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	{@attach surfaceInteraction}
	data-motion-style={motion}
	class={cn('motion-popover', className)}
	{...restProps}
/>
