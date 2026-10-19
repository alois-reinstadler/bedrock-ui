<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-group.svelte';
</script>

<script lang="ts">
	import FieldGroup from '#lib/shadcn/ui/field/field-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldGroup> = $props();
</script>

<FieldGroup bind:ref {...props} />
