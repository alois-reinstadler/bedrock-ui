<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-viewport.svelte';
</script>

<script lang="ts">
	import { surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import NavigationMenuViewport from '#lib/shadcn/ui/navigation-menu/navigation-menu-viewport.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof NavigationMenuViewport> = $props();
</script>

<NavigationMenuViewport
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	class={cn('motion-popover', className)}
	{...props}
/>
