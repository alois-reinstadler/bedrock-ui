<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-title.svelte';
</script>

<script lang="ts">
	import FieldTitle from '#lib/shadcn/ui/field/field-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FieldTitle> = $props();
</script>

<FieldTitle {...props} />
