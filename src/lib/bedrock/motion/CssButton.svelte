<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { motion as astraMotion, type MotionOptions } from 'astra-motion/state';
	import { Button } from '#lib/bedrock/ui/button';

	let {
		ref = $bindable(null),
		motion = {
			initial: false,
			animate: { scale: 1 },
			whileHover: { scale: 1.025 },
			whileTap: { scale: 0.97 },
			transition: { duration: 0.14 }
		},
		...props
	}: ComponentProps<typeof Button> & { motion?: MotionOptions } = $props();
	const binding = astraMotion.bind(() => ({
		...motion,
		disabled: props.disabled || motion.disabled
	}));
</script>

<Button
	{...props}
	{...binding.props}
	bind:ref
	style={`${props.style ?? ''};${binding.props.style}`}
/>
