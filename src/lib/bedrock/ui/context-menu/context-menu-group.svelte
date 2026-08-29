<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-group.svelte';
</script>

<script lang="ts">
	import ContextMenuGroup from '#lib/shadcn/ui/context-menu/context-menu-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuGroup> = $props();
</script>

<ContextMenuGroup {...props} />
