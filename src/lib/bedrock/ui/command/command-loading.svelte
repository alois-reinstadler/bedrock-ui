<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-loading.svelte';
</script>

<script lang="ts">
	import CommandLoading from '#lib/shadcn/ui/command/command-loading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CommandLoading> = $props();
</script>

<CommandLoading bind:ref {...props} />
