<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { Tilt } from 'astra-motion/tilt';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { Spotlight } from '#lib/bedrock/ui/spotlight';

	export type TiltCardProps = HTMLAttributes<HTMLDivElement> & {
		maxTilt?: number;
		perspective?: number;
		spotlight?: boolean;
		disabled?: boolean;
	};
	let {
		children,
		maxTilt = 8,
		perspective = 900,
		spotlight = true,
		disabled = false,
		class: className,
		...rest
	}: TiltCardProps = $props();
	const policy = useMotionPolicy();
	let resting = $state(false);
	const limit = $derived(Number.isFinite(maxTilt) ? Math.min(30, Math.max(0, maxTilt)) : 8);
	// Keyboard focus and scrolling settle decoration; a subsequent pointer move resumes it.
	const interaction: Attachment<HTMLDivElement> = (node) => {
		const reset = () => {
			resting = true;
		};
		const resume = (event: PointerEvent) => {
			if (event.pointerType === 'mouse' || event.pointerType === 'pen') resting = false;
		};
		node.addEventListener('focusin', reset);
		node.addEventListener('pointermove', resume, { passive: true });
		window.addEventListener('scroll', reset, { capture: true, passive: true });
		return () => {
			node.removeEventListener('focusin', reset);
			node.removeEventListener('pointermove', resume);
			window.removeEventListener('scroll', reset, true);
		};
	};
</script>

<div
	{...rest}
	data-slot="tilt-card"
	data-reduced={policy.reduced}
	class={cn('tilt-card', className)}
	{@attach interaction}
>
	<Tilt
		maxRotateX={limit}
		maxRotateY={limit}
		perspective={Number.isFinite(perspective) ? Math.max(100, perspective) : 900}
		disabled={disabled || policy.reduced || resting}
		class="h-full"
	>
		<Spotlight disabled={!spotlight || disabled} class="h-full shadow-sm"
			>{@render children?.()}</Spotlight
		>
	</Tilt>
</div>

<style>
	.tilt-card :global([data-astra-tilt-perspective]),
	.tilt-card :global([data-astra-tilt-content]) {
		height: 100%;
	}
</style>
