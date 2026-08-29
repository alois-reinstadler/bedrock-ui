<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-checkbox-item.svelte';
</script>

<script lang="ts">
	import ContextMenuCheckboxItem from '#lib/shadcn/ui/context-menu/context-menu-checkbox-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuCheckboxItem> = $props();
</script>

<ContextMenuCheckboxItem {...props} />
