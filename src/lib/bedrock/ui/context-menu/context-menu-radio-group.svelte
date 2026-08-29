<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-radio-group.svelte';
</script>

<script lang="ts">
	import ContextMenuRadioGroup from '#lib/shadcn/ui/context-menu/context-menu-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ContextMenuRadioGroup> = $props();
</script>

<ContextMenuRadioGroup {...props} />
