<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
</script>

<script lang="ts">
	import ContextMenuSubContent from '#lib/shadcn/ui/context-menu/context-menu-sub-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuSubContent> = $props();
</script>

<ContextMenuSubContent {...props} />
