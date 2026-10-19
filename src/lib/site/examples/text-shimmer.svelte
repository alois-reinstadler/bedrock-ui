<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { TextShimmer } from '#lib/bedrock/ui/text-shimmer';
	let paused = $state(false);
</script>

<div class="space-y-5 text-center">
	<h3 class="text-3xl font-semibold tracking-tight">
		<TextShimmer {paused}>Something good is taking shape.</TextShimmer>
	</h3>
	<Button
		variant="ghost"
		type="button"
		class={[
			'control-site-examples-text-shimmer h-auto whitespace-normal',
			'rounded-md border px-3 py-1 text-xs'
		]}
		aria-pressed={paused}
		onclick={() => (paused = !paused)}>{paused ? 'Resume shimmer' : 'Pause shimmer'}</Button
	>
</div>
