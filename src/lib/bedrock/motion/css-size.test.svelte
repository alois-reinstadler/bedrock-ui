<script lang="ts">
	import { Size, MotionConfig } from './index.js';
	let expanded = $state(false);
	let reduced = $state(false);
</script>

<button onclick={() => (expanded = !expanded)}>Resize content</button>
<button onclick={() => (reduced = !reduced)}>Reduce sizing motion</button>
<MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
	<Size as="span" duration={0.4} data-testid="size-shell">
		<span data-testid="size-copy" style="display:block; padding:12px; white-space:nowrap">
			{expanded ? 'A longer piece of content, still crisp' : 'Short'}
		</span>
	</Size>
</MotionConfig>
