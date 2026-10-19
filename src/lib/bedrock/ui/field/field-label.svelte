<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-label.svelte';
</script>

<script lang="ts">
	import FieldLabel from '#lib/shadcn/ui/field/field-label.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldLabel> = $props();
</script>

<FieldLabel bind:ref {...props} />
