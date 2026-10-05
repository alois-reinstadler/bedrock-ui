<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-button.svelte';
</script>

<script lang="ts">
	import FormButton from '#lib/shadcn/ui/form/form-button.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FormButton> = $props();
</script>

<FormButton bind:ref {...props} />
