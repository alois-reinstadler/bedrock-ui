<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-checkbox-item.svelte';
</script>

<script lang="ts">
	import MenubarCheckboxItem from '#lib/shadcn/ui/menubar/menubar-checkbox-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarCheckboxItem> = $props();
</script>

<MenubarCheckboxItem {...props} />
