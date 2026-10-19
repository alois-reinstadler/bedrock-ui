<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte';
</script>

<script lang="ts">
	import DropdownMenuSubTrigger from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DropdownMenuSubTrigger> = $props();
</script>

<DropdownMenuSubTrigger bind:ref {...props} />
