<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-content.svelte';
</script>

<script lang="ts">
	import PopoverContent from '#lib/shadcn/ui/popover/popover-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverContent> = $props();
</script>

<PopoverContent {...props} />
