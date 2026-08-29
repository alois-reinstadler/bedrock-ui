<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub-trigger.svelte';
</script>

<script lang="ts">
	import ContextMenuSubTrigger from '#lib/shadcn/ui/context-menu/context-menu-sub-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuSubTrigger> = $props();
</script>

<ContextMenuSubTrigger {...props} />
