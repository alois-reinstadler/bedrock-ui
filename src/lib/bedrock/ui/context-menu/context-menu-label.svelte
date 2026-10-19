<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-label.svelte';
</script>

<script lang="ts">
	import ContextMenuLabel from '#lib/shadcn/ui/context-menu/context-menu-label.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuLabel> = $props();
</script>

<ContextMenuLabel bind:ref {...props} />
