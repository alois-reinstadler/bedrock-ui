<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-item.svelte';
</script>

<script lang="ts">
	import CommandItem from '#lib/shadcn/ui/command/command-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CommandItem> = $props();
</script>

<CommandItem bind:ref {...props} />
