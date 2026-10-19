<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-field.svelte';
</script>

<script lang="ts">
	import FormField from '#lib/shadcn/ui/form/form-field.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FormField> = $props();
</script>

<FormField bind:ref {...props} />
