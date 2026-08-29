<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-footer.svelte';
</script>

<script lang="ts">
	import DialogFooter from '#lib/shadcn/ui/dialog/dialog-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DialogFooter> = $props();
</script>

<DialogFooter {...props} />
