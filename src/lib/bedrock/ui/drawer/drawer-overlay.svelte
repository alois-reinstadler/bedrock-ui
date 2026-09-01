<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
</script>

<script lang="ts">
	import DrawerOverlay from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DrawerOverlay> = $props();
</script>

<DrawerOverlay class={cn('motion-overlay', className)} {...restProps} />
