<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert/alert.svelte';
</script>

<script lang="ts">
	import Alert from '#lib/shadcn/ui/alert/alert.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Alert> = $props();
</script>

<Alert {...props} />
