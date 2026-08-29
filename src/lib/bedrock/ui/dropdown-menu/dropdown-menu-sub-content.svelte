<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-content.svelte';
</script>

<script lang="ts">
	import DropdownMenuSubContent from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuSubContent> = $props();
</script>

<DropdownMenuSubContent {...props} />
