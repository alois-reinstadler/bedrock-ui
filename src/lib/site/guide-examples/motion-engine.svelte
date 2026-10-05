<script lang="ts">
	import { AnimatePresence, motion, useMotionValue } from 'astra-motion';
	import { settleOnReducedMotion } from '#lib/bedrock/motion/settle-motion.svelte.js';
	import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	const policy = useMotionPolicy();
	const opacity = useMotionValue(1);
	settleOnReducedMotion(opacity);
	let open = $state(true);
	const id = $props.id();
</script>

<AstraPolicy>
	<Button
		class="mb-5"
		data-testid="bedrock-engine-toggle"
		aria-expanded={open}
		aria-controls={id}
		onclick={() => (open = !open)}>Toggle spring panel</Button
	>
	<div class="min-h-36">
		<AnimatePresence present={open} initial={false}>
			<motion.div
				style={{ opacity }}
				{id}
				data-testid="bedrock-engine-panel"
				class="rounded-lg bg-muted p-5"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={policy.reduced
					? { duration: 0, delay: 0 }
					: { type: 'spring', stiffness: 380, damping: 32 }}
				inert={!open}
				aria-hidden={!open}
				>The surface follows its latest target when the interaction changes.</motion.div
			>
		</AnimatePresence>
	</div>
</AstraPolicy>
