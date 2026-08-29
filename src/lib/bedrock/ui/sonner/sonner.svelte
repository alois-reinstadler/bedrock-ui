<script lang="ts" module>
	export * from '#lib/shadcn/ui/sonner/sonner.svelte';
</script>

<script lang="ts">
	import Sonner from '#lib/shadcn/ui/sonner/sonner.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Sonner> = $props();
</script>

<Sonner {...props} />
