<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
</script>

<script lang="ts">
	import { surfaceInteraction, surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import DropdownMenuContent from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		motion = 'default',
		...restProps
	}: ComponentProps<typeof DropdownMenuContent> & {
		/** Optional expressive entry; labels never stagger. */ motion?: 'default' | 'soft' | 'stagger';
	} = $props();
</script>

<DropdownMenuContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	{@attach surfaceInteraction}
	data-motion-style={motion}
	class={cn('motion-popover', className)}
	{...restProps}
/>
