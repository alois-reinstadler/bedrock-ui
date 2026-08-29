<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-header.svelte';
</script>

<script lang="ts">
	import AlertDialogHeader from '#lib/shadcn/ui/alert-dialog/alert-dialog-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogHeader> = $props();
</script>

<AlertDialogHeader {...props} />
