<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog.svelte';
</script>

<script lang="ts">
	import AlertDialog from '#lib/shadcn/ui/alert-dialog/alert-dialog.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDialog> = $props();
</script>

<AlertDialog {...props} />
