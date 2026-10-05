<script lang="ts">
	import { untrack } from 'svelte';
	import { useMap } from '../use-map.svelte';
	let { report }: { report: (context: ReturnType<typeof useMap>) => void } = $props();
	const context = useMap();
	untrack(() => report(context));
</script>

<output>{context.resolvedTheme}:{context.isLoaded}:{context.isStyleReady}</output>
