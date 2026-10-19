<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-sub-trigger.svelte';
</script>

<script lang="ts">
	import MenubarSubTrigger from '#lib/shadcn/ui/menubar/menubar-sub-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarSubTrigger> = $props();
</script>

<MenubarSubTrigger bind:ref {...props} />
