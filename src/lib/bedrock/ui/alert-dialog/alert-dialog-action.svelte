<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-action.svelte';
</script>

<script lang="ts">
	import AlertDialogAction from '#lib/shadcn/ui/alert-dialog/alert-dialog-action.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogAction> = $props();
</script>

<AlertDialogAction {...props} />
