<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-item.svelte';
</script>

<script lang="ts">
	import ContextMenuItem from '#lib/shadcn/ui/context-menu/context-menu-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuItem> = $props();
</script>

<ContextMenuItem bind:ref {...props} />
