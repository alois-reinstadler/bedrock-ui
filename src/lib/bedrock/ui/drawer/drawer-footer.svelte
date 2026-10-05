<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-footer.svelte';
</script>

<script lang="ts">
	import DrawerFooter from '#lib/shadcn/ui/drawer/drawer-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DrawerFooter> = $props();
</script>

<DrawerFooter bind:ref {...props} />
