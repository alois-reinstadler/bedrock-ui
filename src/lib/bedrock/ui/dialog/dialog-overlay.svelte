<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
</script>

<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import DialogOverlay from '#lib/shadcn/ui/dialog/dialog-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof DialogOverlay> = $props();
</script>

<DialogOverlay
	bind:ref
	{@attach policy.attach}
	class={cn('motion-overlay', className)}
	{...restProps}
/>
