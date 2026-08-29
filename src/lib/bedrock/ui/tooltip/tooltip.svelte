<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip.svelte';
</script>

<script lang="ts">
	import Tooltip from '#lib/shadcn/ui/tooltip/tooltip.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Tooltip> = $props();
</script>

<Tooltip {...props} />
