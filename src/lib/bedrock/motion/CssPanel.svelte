<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { createMotion, type CssMotionOptions } from 'astra-motion/css';

	let {
		motion = {
			initial: { opacity: 0, y: 12 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -12 },
			transition: { duration: 0.18 }
		},
		children,
		style,
		...props
	}: HTMLAttributes<HTMLDivElement> & { motion?: CssMotionOptions } = $props();
	const binding = createMotion(() => motion);
	const motionTransition = binding.transition;
</script>

<div
	{...props}
	{...binding.props}
	style={`${style ?? ''};${binding.props.style}`}
	transition:motionTransition|global
>
	{@render children?.()}
</div>
