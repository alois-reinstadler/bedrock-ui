<script lang="ts" module>
	export * from '#lib/shadcn/ui/separator/separator.svelte';
</script>

<script lang="ts">
	import Separator from '#lib/shadcn/ui/separator/separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Separator> = $props();
</script>

<Separator {...props} />
