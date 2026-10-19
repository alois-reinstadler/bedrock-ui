<script lang="ts" module>
	export * from '#lib/shadcn/ui/separator/separator.svelte';
</script>

<script lang="ts">
	import Separator from '#lib/shadcn/ui/separator/separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Separator> = $props();
</script>

<Separator bind:ref {...props} />
