<script lang="ts" module>
	export * from '#lib/shadcn/ui/attachment/attachment-media.svelte';
</script>

<script lang="ts">
	import Primitive from '#lib/shadcn/ui/attachment/attachment-media.svelte';
	import type { ComponentProps } from 'svelte';
	let { ref = $bindable(null), ...props }: ComponentProps<typeof Primitive> = $props();
</script>

<Primitive bind:ref {...props} />
