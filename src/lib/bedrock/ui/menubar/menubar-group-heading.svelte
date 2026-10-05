<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-group-heading.svelte';
</script>

<script lang="ts">
	import MenubarGroupHeading from '#lib/shadcn/ui/menubar/menubar-group-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarGroupHeading> = $props();
</script>

<MenubarGroupHeading bind:ref {...props} />
