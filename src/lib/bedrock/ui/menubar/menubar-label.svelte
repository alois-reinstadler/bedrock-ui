<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-label.svelte';
</script>

<script lang="ts">
	import MenubarLabel from '#lib/shadcn/ui/menubar/menubar-label.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarLabel> = $props();
</script>

<MenubarLabel bind:ref {...props} />
