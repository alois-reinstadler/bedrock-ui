<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-list.svelte';
</script>

<script lang="ts">
	import CommandList from '#lib/shadcn/ui/command/command-list.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CommandList> = $props();
</script>

<CommandList {...props} />
