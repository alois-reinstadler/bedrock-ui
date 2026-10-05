<script lang="ts">
	import { AnimatePresence, motion, useMotionValue } from 'astra-motion';
	import { settleOnReducedMotion } from '#lib/bedrock/motion/settle-motion.svelte.js';
	import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	const policy = useMotionPolicy();
	const opacity = useMotionValue(1);
	settleOnReducedMotion(opacity);
	import { Button } from '#lib/bedrock/ui/button';
	let open = $state(false);
	let trigger = $state<HTMLButtonElement | null>(null);
	const id = $props.id();
</script>

<AstraPolicy>
	<Button bind:ref={trigger} aria-expanded={open} aria-controls={id} onclick={() => (open = !open)}
		>Toggle details</Button
	>
	<AnimatePresence present={open}>
		<motion.div
			style={{ opacity }}
			{id}
			class="mt-3 rounded-lg border p-4"
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -8 }}
			transition={{ duration: policy.reduced ? 0 : 0.2 }}
			inert={!open}
			aria-hidden={!open}
		>
			<p class="mb-3">Astra keeps the departing surface mounted until its exit finishes.</p>
			<Button
				variant="outline"
				onclick={() => {
					trigger?.focus();
					open = false;
				}}>Close details</Button
			>
		</motion.div>
	</AnimatePresence>
</AstraPolicy>
