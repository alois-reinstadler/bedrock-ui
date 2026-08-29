<script lang="ts" module>
	export * from '#lib/shadcn/ui/resizable/resizable-pane-group.svelte';
</script>

<script lang="ts">
	import ResizablePaneGroup from '#lib/shadcn/ui/resizable/resizable-pane-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ResizablePaneGroup> = $props();
</script>

<ResizablePaneGroup {...props} />
