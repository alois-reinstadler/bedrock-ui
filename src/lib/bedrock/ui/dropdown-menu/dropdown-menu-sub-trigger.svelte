<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte';
</script>

<script lang="ts">
	import DropdownMenuSubTrigger from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuSubTrigger> = $props();
</script>

<DropdownMenuSubTrigger {...props} />
