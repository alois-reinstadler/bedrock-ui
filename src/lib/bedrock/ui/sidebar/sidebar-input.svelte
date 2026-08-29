<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-input.svelte';
</script>

<script lang="ts">
	import SidebarInput from '#lib/shadcn/ui/sidebar/sidebar-input.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarInput> = $props();
</script>

<SidebarInput {...props} />
