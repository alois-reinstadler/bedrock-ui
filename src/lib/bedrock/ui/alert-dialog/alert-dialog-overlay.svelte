<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
</script>

<script lang="ts">
	import AlertDialogOverlay from '#lib/shadcn/ui/alert-dialog/alert-dialog-overlay.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof AlertDialogOverlay> = $props();
</script>

<AlertDialogOverlay class={cn('motion-overlay', className)} {...restProps} />
