<script lang="ts" module>
	export * from '#lib/shadcn/ui/aspect-ratio/aspect-ratio.svelte';
</script>

<script lang="ts">
	import AspectRatio from '#lib/shadcn/ui/aspect-ratio/aspect-ratio.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AspectRatio> = $props();
</script>

<AspectRatio {...props} />
