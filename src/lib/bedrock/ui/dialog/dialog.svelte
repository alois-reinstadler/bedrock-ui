<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog.svelte';
</script>

<script lang="ts">
	import Dialog from '#lib/shadcn/ui/dialog/dialog.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Dialog> = $props();
</script>

<Dialog {...props} />
