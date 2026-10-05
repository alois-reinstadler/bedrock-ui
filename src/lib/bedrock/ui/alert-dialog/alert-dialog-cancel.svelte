<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-cancel.svelte';
</script>

<script lang="ts">
	import AlertDialogCancel from '#lib/shadcn/ui/alert-dialog/alert-dialog-cancel.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof AlertDialogCancel> = $props();
</script>

<AlertDialogCancel bind:ref {...props} />
