<script lang="ts" module>
	export * from '#lib/shadcn/ui/bubble/bubble-content.svelte';
</script>

<script lang="ts">
	import Primitive from '#lib/shadcn/ui/bubble/bubble-content.svelte';
	import type { ComponentProps } from 'svelte';
	let { ref = $bindable(null), ...props }: ComponentProps<typeof Primitive> = $props();
</script>

<Primitive bind:ref {...props} />
