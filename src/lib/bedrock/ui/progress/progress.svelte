<script lang="ts" module>
	export * from '#lib/shadcn/ui/progress/progress.svelte';
</script>

<script lang="ts">
	import Progress from '#lib/shadcn/ui/progress/progress.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof Progress> = $props();
</script>

<Progress bind:ref {...props} />
