<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-shortcut.svelte';
</script>

<script lang="ts">
	import CommandShortcut from '#lib/shadcn/ui/command/command-shortcut.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CommandShortcut> = $props();
</script>

<CommandShortcut {...props} />
