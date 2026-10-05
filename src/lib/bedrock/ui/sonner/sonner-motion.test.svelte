<script lang="ts">
	import '../../styles.css';
	import { toast } from 'svelte-sonner';
	import Toaster from './sonner.svelte';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';

	let { reduced = false, id = 'motion-toast-test' }: { reduced?: boolean; id?: string } = $props();
	function show() {
		toast('Saved changes', {
			id,
			toasterId: id,
			duration: Infinity,
			action: { label: 'Undo', onClick: () => {} }
		});
	}
</script>

<MotionProvider {reduced}>
	<button type="button" data-show onclick={show}>Show toast</button>
	<button type="button" data-outside>Other control</button>
	<Toaster {id} closeButton />
</MotionProvider>
