<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-set.svelte';
</script>

<script lang="ts">
	import FieldSet from '#lib/shadcn/ui/field/field-set.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldSet> = $props();
</script>

<FieldSet bind:ref {...props} />
