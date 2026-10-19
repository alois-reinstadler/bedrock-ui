<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import AsyncButton from './async-button.svelte';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';

	let {
		action,
		resetAfter = 40,
		interruptible = false,
		disabled = false,
		onError,
		reduced = false
	}: Pick<
		ComponentProps<typeof AsyncButton>,
		'action' | 'resetAfter' | 'interruptible' | 'disabled' | 'onError'
	> & { reduced?: boolean } = $props();
</script>

<MotionProvider {reduced}>
	<AsyncButton {action} {resetAfter} {interruptible} {disabled} {onError}>Upload</AsyncButton>
</MotionProvider>
