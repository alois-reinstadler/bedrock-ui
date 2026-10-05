<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-title.svelte';
</script>

<script lang="ts">
	import PopoverTitle from '#lib/shadcn/ui/popover/popover-title.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof PopoverTitle> = $props();
</script>

<PopoverTitle bind:ref {...props} />
