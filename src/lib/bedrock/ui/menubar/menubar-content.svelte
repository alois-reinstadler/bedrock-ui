<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-content.svelte';
</script>

<script lang="ts">
	import MenubarContent from '#lib/shadcn/ui/menubar/menubar-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarContent> = $props();
</script>

<MenubarContent {...props} />
