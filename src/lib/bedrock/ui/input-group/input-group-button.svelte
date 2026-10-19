<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-button.svelte';
</script>

<script lang="ts">
	import InputGroupButton from '#lib/shadcn/ui/input-group/input-group-button.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof InputGroupButton> = $props();
</script>

<InputGroupButton bind:ref {...props} />
