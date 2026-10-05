<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-title.svelte';
</script>

<script lang="ts">
	import DialogTitle from '#lib/shadcn/ui/dialog/dialog-title.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DialogTitle> = $props();
</script>

<DialogTitle bind:ref {...props} />
