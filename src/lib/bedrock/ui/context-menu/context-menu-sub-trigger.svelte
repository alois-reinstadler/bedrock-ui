<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub-trigger.svelte';
</script>

<script lang="ts">
	import ContextMenuSubTrigger from '#lib/shadcn/ui/context-menu/context-menu-sub-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuSubTrigger> = $props();
</script>

<ContextMenuSubTrigger bind:ref {...props} />
