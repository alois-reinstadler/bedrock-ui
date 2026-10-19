<script lang="ts">
	import MotionProvider from '../MotionProvider.svelte';
	import Reader from './Reader.svelte';
	let { reduced = false, nestedReduced = false }: { reduced?: boolean; nestedReduced?: boolean } =
		$props();
</script>

<MotionProvider {reduced}>
	<MotionProvider reduced={nestedReduced}>
		<Reader />
	</MotionProvider>
</MotionProvider>
