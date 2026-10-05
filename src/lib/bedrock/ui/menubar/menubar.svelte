<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar.svelte';
</script>

<script lang="ts">
	import Menubar from '#lib/shadcn/ui/menubar/menubar.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Menubar> = $props();
</script>

<Menubar bind:ref {...props} />
