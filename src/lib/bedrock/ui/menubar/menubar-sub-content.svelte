<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-sub-content.svelte';
</script>

<script lang="ts">
	import MenubarSubContent from '#lib/shadcn/ui/menubar/menubar-sub-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarSubContent> = $props();
</script>

<MenubarSubContent {...props} />
