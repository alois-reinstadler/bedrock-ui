<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-button.svelte';
</script>

<script lang="ts">
	import SidebarMenuButton from '#lib/shadcn/ui/sidebar/sidebar-menu-button.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...props }: ComponentProps<typeof SidebarMenuButton> = $props();
</script>

<SidebarMenuButton {...props} class={cn('data-[active=false]:hover:bg-sidebar-hover', className)} />
