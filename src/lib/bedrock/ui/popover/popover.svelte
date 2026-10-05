<script lang="ts" module>
	export * from '#lib/shadcn/ui/popover/popover.svelte';
</script>

<script lang="ts">
	import Popover from '#lib/shadcn/ui/popover/popover.svelte';
	import type { ComponentProps } from 'svelte';

	let { open = $bindable(false), ...props }: ComponentProps<typeof Popover> = $props();
</script>

<Popover bind:open {...props} />
