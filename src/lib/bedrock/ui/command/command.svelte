<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command.svelte';
</script>

<script lang="ts">
	import Command from '#lib/shadcn/ui/command/command.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Command> = $props();
</script>

<Command {...props} />
