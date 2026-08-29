<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-fieldset.svelte';
</script>

<script lang="ts">
	import FormFieldset from '#lib/shadcn/ui/form/form-fieldset.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FormFieldset> = $props();
</script>

<FormFieldset {...props} />
