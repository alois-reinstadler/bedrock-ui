<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-dialog.svelte';
</script>

<script lang="ts">
	import CommandDialog from '#lib/shadcn/ui/command/command-dialog.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CommandDialog> = $props();
</script>

<CommandDialog {...props} />
