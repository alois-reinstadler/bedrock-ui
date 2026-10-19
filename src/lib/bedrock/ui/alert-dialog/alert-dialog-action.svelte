<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-action.svelte';
</script>

<script lang="ts">
	import AlertDialogAction from '#lib/shadcn/ui/alert-dialog/alert-dialog-action.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AlertDialogAction> = $props();
</script>

<AlertDialogAction bind:ref {...props} />
