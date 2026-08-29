<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-input.svelte';
</script>

<script lang="ts">
	import CommandInput from '#lib/shadcn/ui/command/command-input.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CommandInput> = $props();
</script>

<CommandInput {...props} />
