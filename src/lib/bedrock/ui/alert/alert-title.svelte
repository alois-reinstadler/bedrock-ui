<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert/alert-title.svelte';
</script>

<script lang="ts">
	import AlertTitle from '#lib/shadcn/ui/alert/alert-title.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AlertTitle> = $props();
</script>

<AlertTitle bind:ref {...props} />
