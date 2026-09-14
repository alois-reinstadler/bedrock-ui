<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { createMotion, type CssMotionOptions } from 'astra-motion/css';
	import { Button } from '#lib/bedrock/ui/button';

	let {
		motion = {
			initial: false,
			animate: { scale: 1 },
			whileHover: { scale: 1.025 },
			whileTap: { scale: 0.97 },
			transition: { duration: 0.14 }
		},
		...props
	}: ComponentProps<typeof Button> & { motion?: CssMotionOptions } = $props();
	const binding = createMotion(() => ({ ...motion, disabled: props.disabled || motion.disabled }));
</script>

<Button {...props} {...binding.props} style={`${props.style ?? ''};${binding.props.style}`} />
