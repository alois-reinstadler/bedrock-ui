<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-radio-item.svelte';
</script>

<script lang="ts">
	import ContextMenuRadioItem from '#lib/shadcn/ui/context-menu/context-menu-radio-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuRadioItem> = $props();
</script>

<ContextMenuRadioItem bind:ref {...props} />
