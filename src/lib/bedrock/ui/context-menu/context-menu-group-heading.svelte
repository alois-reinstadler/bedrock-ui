<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-group-heading.svelte';
</script>

<script lang="ts">
	import ContextMenuGroupHeading from '#lib/shadcn/ui/context-menu/context-menu-group-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ContextMenuGroupHeading> =
		$props();
</script>

<ContextMenuGroupHeading bind:ref {...props} />
