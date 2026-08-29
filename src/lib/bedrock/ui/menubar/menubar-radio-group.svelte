<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-radio-group.svelte';
</script>

<script lang="ts">
	import MenubarRadioGroup from '#lib/shadcn/ui/menubar/menubar-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof MenubarRadioGroup> = $props();
</script>

<MenubarRadioGroup {...props} />
