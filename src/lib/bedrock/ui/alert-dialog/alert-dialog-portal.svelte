<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-portal.svelte';
</script>

<script lang="ts">
	import AlertDialogPortal from '#lib/shadcn/ui/alert-dialog/alert-dialog-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogPortal> = $props();
</script>

<AlertDialogPortal {...props} />
