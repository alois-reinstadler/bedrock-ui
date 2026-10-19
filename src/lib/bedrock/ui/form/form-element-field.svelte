<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-element-field.svelte';
</script>

<script lang="ts">
	import FormElementField from '#lib/shadcn/ui/form/form-element-field.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FormElementField> = $props();
</script>

<FormElementField bind:ref {...props} />
