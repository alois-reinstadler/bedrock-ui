<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-item.svelte';
</script>

<script lang="ts">
	import SelectItem from '#lib/shadcn/ui/select/select-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectItem> = $props();
</script>

<SelectItem {...props} />
