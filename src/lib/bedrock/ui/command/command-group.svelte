<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-group.svelte';
</script>

<script lang="ts">
	import CommandGroup from '#lib/shadcn/ui/command/command-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CommandGroup> = $props();
</script>

<CommandGroup bind:ref {...props} />
