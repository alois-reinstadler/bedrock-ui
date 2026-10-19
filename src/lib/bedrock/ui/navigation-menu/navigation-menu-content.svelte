<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-content.svelte';
</script>

<script lang="ts">
	import { surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import NavigationMenuContent from '#lib/shadcn/ui/navigation-menu/navigation-menu-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof NavigationMenuContent> = $props();
</script>

<NavigationMenuContent
	bind:ref
	{@attach policy.attach}
	{@attach surfacePresence}
	class={cn('motion-navigation', className)}
	{...props}
/>
