<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-trigger.svelte';
</script>

<script lang="ts">
	import MenubarTrigger from '#lib/shadcn/ui/menubar/menubar-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarTrigger> = $props();
</script>

<MenubarTrigger {...props} />
