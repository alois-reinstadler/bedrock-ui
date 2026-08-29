<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
</script>

<script lang="ts">
	import ContextMenuContent from '#lib/shadcn/ui/context-menu/context-menu-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuContent> = $props();
</script>

<ContextMenuContent {...props} />
