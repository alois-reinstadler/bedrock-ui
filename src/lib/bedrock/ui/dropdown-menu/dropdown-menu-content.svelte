<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
</script>

<script lang="ts">
	import DropdownMenuContent from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuContent> = $props();
</script>

<DropdownMenuContent {...props} />
