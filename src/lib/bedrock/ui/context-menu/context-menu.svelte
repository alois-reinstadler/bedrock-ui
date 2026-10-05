<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu.svelte';
</script>

<script lang="ts">
	import ContextMenu from '#lib/shadcn/ui/context-menu/context-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let { open = $bindable(false), ...props }: ComponentProps<typeof ContextMenu> = $props();
</script>

<ContextMenu bind:open {...props} />
