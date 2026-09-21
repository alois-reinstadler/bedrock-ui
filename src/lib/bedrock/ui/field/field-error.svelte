<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-error.svelte';
</script>

<script lang="ts">
	import FieldError from '#lib/shadcn/ui/field/field-error.svelte';
	import type { ComponentProps } from 'svelte';

	let { errors, ...props }: ComponentProps<typeof FieldError> = $props();

	// Presence and list layout depend on visible messages, not validation metadata.
	const visibleErrors = $derived(errors?.filter((error) => error.message));
</script>

<FieldError errors={visibleErrors} {...props} />
