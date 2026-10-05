<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-sub-content.svelte';
</script>

<script lang="ts">
	import { surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import MenubarSubContent from '#lib/shadcn/ui/menubar/menubar-sub-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof MenubarSubContent> = $props();
</script>

<MenubarSubContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	class={cn('motion-popover', className)}
	{...props}
/>
