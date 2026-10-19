<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-description.svelte';
</script>

<script lang="ts">
	import PopoverDescription from '#lib/shadcn/ui/popover/popover-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof PopoverDescription> = $props();
</script>

<PopoverDescription bind:ref {...props} />
