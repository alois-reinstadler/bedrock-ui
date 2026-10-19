<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-radio-item.svelte';
</script>

<script lang="ts">
	import MenubarRadioItem from '#lib/shadcn/ui/menubar/menubar-radio-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarRadioItem> = $props();
</script>

<MenubarRadioItem bind:ref {...props} />
