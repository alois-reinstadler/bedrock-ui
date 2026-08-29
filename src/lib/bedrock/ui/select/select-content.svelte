<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select-content.svelte';
</script>

<script lang="ts">
	import SelectContent from '#lib/shadcn/ui/select/select-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SelectContent> = $props();
</script>

<SelectContent {...props} />
