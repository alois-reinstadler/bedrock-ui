<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-menu.svelte';
</script>

<script lang="ts">
	import MenubarMenu from '#lib/shadcn/ui/menubar/menubar-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarMenu> = $props();
</script>

<MenubarMenu {...props} />
