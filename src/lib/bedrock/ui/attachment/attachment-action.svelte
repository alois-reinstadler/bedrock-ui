<script lang="ts" module>
	export * from '#lib/shadcn/ui/attachment/attachment-action.svelte';
</script>

<script lang="ts">
	import Primitive from '#lib/shadcn/ui/attachment/attachment-action.svelte';
	import type { ComponentProps } from 'svelte';
	let { ref = $bindable(null), ...props }: ComponentProps<typeof Primitive> = $props();
</script>

<Primitive bind:ref {...props} />
