<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-button.svelte';
</script>

<script lang="ts">
	import FormButton from '#lib/shadcn/ui/form/form-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FormButton> = $props();
</script>

<FormButton {...props} />
