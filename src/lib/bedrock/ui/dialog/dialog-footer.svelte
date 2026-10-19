<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-footer.svelte';
</script>

<script lang="ts">
	import DialogFooter from '#lib/shadcn/ui/dialog/dialog-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DialogFooter> = $props();
</script>

<DialogFooter bind:ref {...props} />
