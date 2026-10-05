<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-item.svelte';
</script>

<script lang="ts">
	import SelectItem from '#lib/shadcn/ui/select/select-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SelectItem> = $props();
</script>

<SelectItem bind:ref {...props} />
