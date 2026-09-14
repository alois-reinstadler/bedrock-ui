<script lang="ts">
	import { MotionConfig } from './config.js';
	import { CssButton, CssPanel } from './css.js';
	let reduced = $state(false);
</script>

<button onclick={() => (reduced = !reduced)}>Change policy</button>
<MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
	<CssButton data-testid="policy-button">Default feedback</CssButton>
	<CssPanel data-testid="default-panel">Essential content</CssPanel>
	<CssPanel
		data-testid="policy-panel"
		motion={{ initial: false, animate: { x: 32 }, transition: { duration: 0.05 } }}
		>Provider-controlled movement</CssPanel
	>
</MotionConfig>
