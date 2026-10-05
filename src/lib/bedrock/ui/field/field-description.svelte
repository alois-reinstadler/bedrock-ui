<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-description.svelte';
</script>

<script lang="ts">
	import FieldDescription from '#lib/shadcn/ui/field/field-description.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldDescription> = $props();
</script>

<FieldDescription bind:ref {...props} />
