<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub.svelte';
</script>

<script lang="ts">
	import DropdownMenuSub from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuSub> = $props();
</script>

<DropdownMenuSub {...props} />
