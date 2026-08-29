<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-portal.svelte';
</script>

<script lang="ts">
	import ContextMenuPortal from '#lib/shadcn/ui/context-menu/context-menu-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuPortal> = $props();
</script>

<ContextMenuPortal {...props} />
