<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-close.svelte';
</script>

<script lang="ts">
	import PopoverClose from '#lib/shadcn/ui/popover/popover-close.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverClose> = $props();
</script>

<PopoverClose {...props} />
