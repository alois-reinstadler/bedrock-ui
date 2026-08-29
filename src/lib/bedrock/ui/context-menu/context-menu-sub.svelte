<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-sub.svelte';
</script>

<script lang="ts">
	import ContextMenuSub from '#lib/shadcn/ui/context-menu/context-menu-sub.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuSub> = $props();
</script>

<ContextMenuSub {...props} />
