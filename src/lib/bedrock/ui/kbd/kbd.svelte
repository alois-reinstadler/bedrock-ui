<script lang="ts" module>
	export * from '#lib/shadcn/ui/kbd/kbd.svelte';
</script>

<script lang="ts">
	import Kbd from '#lib/shadcn/ui/kbd/kbd.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Kbd> = $props();
</script>

<Kbd {...props} />
