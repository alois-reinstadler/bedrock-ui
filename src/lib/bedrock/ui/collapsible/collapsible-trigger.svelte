<script lang="ts" module>
	export * from '#lib/shadcn/ui/collapsible/collapsible-trigger.svelte';
</script>

<script lang="ts">
	import CollapsibleTrigger from '#lib/shadcn/ui/collapsible/collapsible-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CollapsibleTrigger> = $props();
</script>

<CollapsibleTrigger bind:ref {...props} />
