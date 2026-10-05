<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
</script>

<script lang="ts">
	import { surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import ContextMenuSubContent from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof ContextMenuSubContent> = $props();
</script>

<ContextMenuSubContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	class={cn('motion-popover', className)}
	{...restProps}
/>
