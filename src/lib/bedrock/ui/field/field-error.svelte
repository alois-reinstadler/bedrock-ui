<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-error.svelte';
</script>

<script lang="ts">
	import FieldError from '#lib/shadcn/ui/field/field-error.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FieldError> = $props();
</script>

<FieldError {...props} />
