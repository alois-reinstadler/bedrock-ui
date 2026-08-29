<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-separator.svelte';
</script>

<script lang="ts">
	import SelectSeparator from '#lib/shadcn/ui/select/select-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectSeparator> = $props();
</script>

<SelectSeparator {...props} />
