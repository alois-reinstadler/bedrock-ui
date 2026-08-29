<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-content.svelte';
</script>

<script lang="ts">
	import DrawerContent from '#lib/shadcn/ui/drawer/drawer-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerContent> = $props();
</script>

<DrawerContent {...props} />
