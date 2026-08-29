<script lang="ts" module>
	export * from '#lib/shadcn/ui/alert/alert-description.svelte';
</script>

<script lang="ts">
	import AlertDescription from '#lib/shadcn/ui/alert/alert-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AlertDescription> = $props();
</script>

<AlertDescription {...props} />
