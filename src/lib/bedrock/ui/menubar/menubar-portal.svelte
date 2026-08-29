<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-portal.svelte';
</script>

<script lang="ts">
	import MenubarPortal from '#lib/shadcn/ui/menubar/menubar-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarPortal> = $props();
</script>

<MenubarPortal {...props} />
