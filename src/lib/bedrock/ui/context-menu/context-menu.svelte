<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu.svelte';
</script>

<script lang="ts">
	import ContextMenu from '#lib/shadcn/ui/context-menu/context-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenu> = $props();
</script>

<ContextMenu {...props} />
