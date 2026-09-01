<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-content.svelte';
</script>

<script lang="ts">
	import DialogContent from '#lib/shadcn/ui/dialog/dialog-content.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let { class: className, ...restProps }: ComponentProps<typeof DialogContent> = $props();
</script>

<DialogContent class={cn('motion-overlay', className)} {...restProps} />
