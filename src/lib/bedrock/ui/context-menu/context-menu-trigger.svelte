<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-trigger.svelte';
</script>

<script lang="ts">
	import ContextMenuTrigger from '#lib/shadcn/ui/context-menu/context-menu-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuTrigger> = $props();
</script>

<ContextMenuTrigger bind:ref {...props} />
