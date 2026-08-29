<script lang="ts" module>
	export * from '#lib/shadcn/ui/resizable/resizable-handle.svelte';
</script>

<script lang="ts">
	import ResizableHandle from '#lib/shadcn/ui/resizable/resizable-handle.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ResizableHandle> = $props();
</script>

<ResizableHandle {...props} />
