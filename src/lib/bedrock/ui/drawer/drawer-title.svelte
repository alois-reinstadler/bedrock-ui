<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-title.svelte';
</script>

<script lang="ts">
	import DrawerTitle from '#lib/shadcn/ui/drawer/drawer-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerTitle> = $props();
</script>

<DrawerTitle {...props} />
