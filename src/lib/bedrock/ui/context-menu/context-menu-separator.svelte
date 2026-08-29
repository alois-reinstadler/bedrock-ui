<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-separator.svelte';
</script>

<script lang="ts">
	import ContextMenuSeparator from '#lib/shadcn/ui/context-menu/context-menu-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuSeparator> = $props();
</script>

<ContextMenuSeparator {...props} />
