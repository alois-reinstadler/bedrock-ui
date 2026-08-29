<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-title.svelte';
</script>

<script lang="ts">
	import AlertDialogTitle from '#lib/shadcn/ui/alert-dialog/alert-dialog-title.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialogTitle> = $props();
</script>

<AlertDialogTitle {...props} />
