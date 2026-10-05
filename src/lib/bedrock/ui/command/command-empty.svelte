<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-empty.svelte';
</script>

<script lang="ts">
	import CommandEmpty from '#lib/shadcn/ui/command/command-empty.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CommandEmpty> = $props();
</script>

<CommandEmpty bind:ref {...props} />
