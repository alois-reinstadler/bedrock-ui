<script lang="ts">
	import { useMotionPolicy } from '../policy.svelte.js';
	const policy = useMotionPolicy();
</script>

<p data-policy={policy.reduced ? 'reduced' : 'full'}>Essential content</p>
