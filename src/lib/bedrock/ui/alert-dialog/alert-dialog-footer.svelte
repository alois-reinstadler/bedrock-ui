<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-footer.svelte';
</script>

<script lang="ts">
	import AlertDialogFooter from '#lib/shadcn/ui/alert-dialog/alert-dialog-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogFooter> = $props();
</script>

<AlertDialogFooter {...props} />
