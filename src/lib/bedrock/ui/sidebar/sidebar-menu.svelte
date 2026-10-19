<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu.svelte';
</script>

<script lang="ts">
	import SidebarMenu from '#lib/shadcn/ui/sidebar/sidebar-menu.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof SidebarMenu> = $props();
</script>

<SidebarMenu bind:ref {...props} class={cn('gap-1', className)} />
