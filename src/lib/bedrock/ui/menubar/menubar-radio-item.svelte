<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-radio-item.svelte';
</script>

<script lang="ts">
	import MenubarRadioItem from '#lib/shadcn/ui/menubar/menubar-radio-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarRadioItem> = $props();
</script>

<MenubarRadioItem {...props} />
