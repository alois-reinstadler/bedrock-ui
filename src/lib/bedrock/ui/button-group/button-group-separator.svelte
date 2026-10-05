<script lang="ts" module>
	export * from '#lib/shadcn/ui/button-group/button-group-separator.svelte';
</script>

<script lang="ts">
	import ButtonGroupSeparator from '#lib/shadcn/ui/button-group/button-group-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ButtonGroupSeparator> = $props();
</script>

<ButtonGroupSeparator bind:ref {...props} />
