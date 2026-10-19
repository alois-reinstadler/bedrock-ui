<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
</script>

<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import DrawerOverlay from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof DrawerOverlay> = $props();
</script>

<DrawerOverlay
	bind:ref
	{@attach policy.attach}
	class={cn('motion-vaul', className)}
	{...restProps}
/>
