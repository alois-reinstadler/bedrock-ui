<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-sub.svelte';
</script>

<script lang="ts">
	import MenubarSub from '#lib/shadcn/ui/menubar/menubar-sub.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarSub> = $props();
</script>

<MenubarSub {...props} />
