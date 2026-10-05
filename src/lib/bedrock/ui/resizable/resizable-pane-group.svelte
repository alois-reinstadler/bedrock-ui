<script lang="ts" module>
	export * from '#lib/shadcn/ui/resizable/resizable-pane-group.svelte';
</script>

<script lang="ts">
	import ResizablePaneGroup from '#lib/shadcn/ui/resizable/resizable-pane-group.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		this: paneGroup = $bindable(),
		...props
	}: ComponentProps<typeof ResizablePaneGroup> = $props();
</script>

<ResizablePaneGroup
	bind:ref
	{...props}
	{...{
		get this() {
			return paneGroup;
		},
		set this(value: ComponentProps<typeof ResizablePaneGroup>['this']) {
			paneGroup = value;
		}
	}}
/>
