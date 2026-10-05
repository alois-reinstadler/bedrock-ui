<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-trigger.svelte';
</script>

<script lang="ts">
	import SelectTrigger from '#lib/shadcn/ui/select/select-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SelectTrigger> = $props();
</script>

<SelectTrigger bind:ref {...props} />
