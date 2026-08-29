<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-header.svelte';
</script>

<script lang="ts">
	import PopoverHeader from '#lib/shadcn/ui/popover/popover-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverHeader> = $props();
</script>

<PopoverHeader {...props} />
