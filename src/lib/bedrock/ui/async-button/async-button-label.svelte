<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import { motionValue } from 'astra-motion/values';
	import * as m from 'astra-motion/m';
	import { useIsPresent } from 'astra-motion/presence';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { astraPresets } from '#lib/bedrock/motion/astra-presets.js';
	import { settleOnReducedMotion } from '#lib/bedrock/motion/settle-motion.svelte.js';

	let {
		children,
		effect: labelEffect,
		direction
	}: {
		children: Snippet;
		effect: 'fade' | 'slide-up';
		direction: 'forward' | 'backward';
	} = $props();
	const present = useIsPresent();
	const policy = useMotionPolicy();
	// These values belong only to this label, so live reduction can finish paint
	// as well as position without cancelling another component's playback.
	const opacity = motionValue(1);
	const y = motionValue(0);
	settleOnReducedMotion(opacity);
	settleOnReducedMotion(y);
	onDestroy(() => {
		opacity.destroy();
		y.destroy();
	});
	const offset = $derived(
		labelEffect === 'slide-up' && !policy.reduced ? (direction === 'forward' ? 8 : -8) : 0
	);
</script>

<m.span
	style={{ opacity, y }}
	data-slot="async-button-label"
	data-present={present.current}
	aria-hidden={!present.current || undefined}
	inert={!present.current}
	initial={policy.reduced ? false : { opacity: 0, y: offset }}
	animate={{ opacity: 1, y: 0 }}
	exit={{ opacity: policy.reduced ? 1 : 0, y: -offset }}
	transition={policy.reduced ? { duration: 0 } : astraPresets.labelReplacement}
	class="inline-flex items-center justify-center gap-2 whitespace-nowrap"
>
	{@render children()}
</m.span>
