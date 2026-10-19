<script lang="ts">
	import { MotionButton, MotionPanel } from '#lib/bedrock/motion/bindings.js';
	import { MotionConfig } from '#lib/bedrock/motion/config.js';
	let open = $state(false);
</script>

<MotionConfig reducedMotion="user">
	<MotionButton aria-expanded={open} aria-controls="motion-details" onclick={() => (open = !open)}
		>Toggle details</MotionButton
	>
	{#if open}
		<MotionPanel
			id="motion-details"
			motion={{
				initial: { opacity: 0, y: 8 },
				animate: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: -8 },
				transition: { duration: 0.2 }
			}}>Your details remain mounted until the exit finishes.</MotionPanel
		>
	{/if}
</MotionConfig>
