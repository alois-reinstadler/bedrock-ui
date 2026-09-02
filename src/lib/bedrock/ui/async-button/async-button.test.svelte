<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import AsyncButton from './async-button.svelte';

	let {
		action,
		resetAfter = 40,
		interruptible = false,
		disabled = false,
		onError
	}: Pick<
		ComponentProps<typeof AsyncButton>,
		'action' | 'resetAfter' | 'interruptible' | 'disabled' | 'onError'
	> = $props();
</script>

<AsyncButton {action} {resetAfter} {interruptible} {disabled} {onError}>Upload</AsyncButton>
