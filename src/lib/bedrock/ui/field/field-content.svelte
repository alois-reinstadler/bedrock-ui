<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-content.svelte';
</script>

<script lang="ts">
	import FieldContent from '#lib/shadcn/ui/field/field-content.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldContent> = $props();
</script>

<FieldContent bind:ref {...props} />
