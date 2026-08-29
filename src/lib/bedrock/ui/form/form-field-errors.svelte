<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-field-errors.svelte';
</script>

<script lang="ts">
	import FormFieldErrors from '#lib/shadcn/ui/form/form-field-errors.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FormFieldErrors> = $props();
</script>

<FormFieldErrors {...props} />
