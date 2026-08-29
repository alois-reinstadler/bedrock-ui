<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-shortcut.svelte';
</script>

<script lang="ts">
	import ContextMenuShortcut from '#lib/shadcn/ui/context-menu/context-menu-shortcut.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuShortcut> = $props();
</script>

<ContextMenuShortcut {...props} />
