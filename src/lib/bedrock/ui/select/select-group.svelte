<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-group.svelte';
</script>

<script lang="ts">
	import SelectGroup from '#lib/shadcn/ui/select/select-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SelectGroup> = $props();
</script>

<SelectGroup bind:ref {...props} />
