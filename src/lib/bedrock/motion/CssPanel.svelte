<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { createMotion, type CssMotionOptions } from 'astra-motion/css';

	let {
		ref = $bindable(null),
		motion = {
			initial: false,
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -12 },
			transition: { duration: 0.18 }
		},
		children,
		style,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		motion?: CssMotionOptions;
		ref?: HTMLDivElement | null;
	} = $props();
	const binding = createMotion(() => motion);
	const motionTransition = binding.transition;
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			ref = null;
		};
	}}
	{...props}
	{...binding.props}
	style={`${style ?? ''};${binding.props.style}`}
	transition:motionTransition|global
>
	{@render children?.()}
</div>
