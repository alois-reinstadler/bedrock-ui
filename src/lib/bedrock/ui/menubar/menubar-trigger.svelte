<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-trigger.svelte';
</script>

<script lang="ts">
	import MenubarTrigger from '#lib/shadcn/ui/menubar/menubar-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarTrigger> = $props();
</script>

<MenubarTrigger bind:ref {...props} />
