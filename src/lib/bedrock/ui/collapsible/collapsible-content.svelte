<script lang="ts" module>
	export * from '#lib/shadcn/ui/collapsible/collapsible-content.svelte';
</script>

<script lang="ts">
	import CollapsibleContent from '#lib/shadcn/ui/collapsible/collapsible-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CollapsibleContent> = $props();
</script>

<CollapsibleContent {...props} />
