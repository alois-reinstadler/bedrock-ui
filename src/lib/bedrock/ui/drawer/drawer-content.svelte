<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-content.svelte';
</script>

<script lang="ts">
	import DrawerContent from '#lib/shadcn/ui/drawer/drawer-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DrawerContent> = $props();
</script>

<DrawerContent class={cn('motion-drawer', className)} {...restProps} />
