<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-trigger.svelte';
</script>

<script lang="ts">
	import DropdownMenuTrigger from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuTrigger> = $props();
</script>

<DropdownMenuTrigger {...props} />
