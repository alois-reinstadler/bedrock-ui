<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-group-heading.svelte';
</script>

<script lang="ts">
	import SelectGroupHeading from '#lib/shadcn/ui/select/select-group-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SelectGroupHeading> = $props();
</script>

<SelectGroupHeading bind:ref {...props} />
