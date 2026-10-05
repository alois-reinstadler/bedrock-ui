<script lang="ts" module>
	export * from '#lib/shadcn/ui/collapsible/collapsible.svelte';
</script>

<script lang="ts">
	import Collapsible from '#lib/shadcn/ui/collapsible/collapsible.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		open = $bindable(false),
		...props
	}: ComponentProps<typeof Collapsible> = $props();
</script>

<Collapsible bind:ref bind:open {...props} />
