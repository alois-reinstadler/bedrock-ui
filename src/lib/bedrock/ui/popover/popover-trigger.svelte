<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-trigger.svelte';
</script>

<script lang="ts">
	import PopoverTrigger from '#lib/shadcn/ui/popover/popover-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverTrigger> = $props();
</script>

<PopoverTrigger {...props} />
