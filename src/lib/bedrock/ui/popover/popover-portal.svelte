<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover-portal.svelte';
</script>

<script lang="ts">
	import PopoverPortal from '#lib/shadcn/ui/popover/popover-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof PopoverPortal> = $props();
</script>

<PopoverPortal {...props} />
