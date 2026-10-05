<script lang="ts" module>
	export * from '#lib/shadcn/ui/dialog/dialog-trigger.svelte';
</script>

<script lang="ts">
	import DialogTrigger from '#lib/shadcn/ui/dialog/dialog-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DialogTrigger> = $props();
</script>

<DialogTrigger bind:ref {...props} />
