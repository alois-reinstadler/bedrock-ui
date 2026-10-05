<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-content.svelte';
</script>

<script lang="ts">
	import { surfaceInteraction, surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import MenubarContent from '#lib/shadcn/ui/menubar/menubar-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		motion = 'default',
		...props
	}: ComponentProps<typeof MenubarContent> & {
		/** Optional expressive entry; labels never stagger. */ motion?: 'default' | 'soft';
	} = $props();
</script>

<MenubarContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	{@attach surfaceInteraction}
	data-motion-style={motion}
	class={cn('motion-popover', className)}
	{...props}
/>
