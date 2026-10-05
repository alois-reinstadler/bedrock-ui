<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert/alert-action.svelte';
</script>

<script lang="ts">
	import AlertAction from '#lib/shadcn/ui/alert/alert-action.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AlertAction> = $props();
</script>

<AlertAction bind:ref {...props} />
