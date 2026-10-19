<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-separator.svelte';
</script>

<script lang="ts">
	import CommandSeparator from '#lib/shadcn/ui/command/command-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CommandSeparator> = $props();
</script>

<CommandSeparator bind:ref {...props} />
