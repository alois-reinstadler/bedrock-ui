<script lang="ts">
	import { MotionConfig, motion } from 'astra-motion';
	import { Button } from '#lib/bedrock/ui/button';
	let reduced = $state(false);
	let x = $state(32);
</script>

<Button
	onclick={() => {
		reduced = !reduced;
		x = reduced ? 64 : 32;
	}}>Change policy</Button
>
<MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
	<Button data-testid="policy-button">Default feedback</Button>
	<motion.div data-testid="default-panel" initial={false}>Essential content</motion.div>
	<motion.div
		data-testid="policy-panel"
		initial={false}
		animate={{ x }}
		transition={{ duration: 0.05 }}>Provider-controlled movement</motion.div
	>
</MotionConfig>
