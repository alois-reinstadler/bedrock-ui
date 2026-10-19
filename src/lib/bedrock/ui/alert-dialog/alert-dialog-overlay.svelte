<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
</script>

<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import AlertDialogOverlay from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof AlertDialogOverlay> = $props();
</script>

<AlertDialogOverlay
	bind:ref
	{@attach policy.attach}
	class={cn('motion-overlay', className)}
	{...restProps}
/>
