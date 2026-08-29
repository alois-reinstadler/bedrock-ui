<script lang="ts" module>
	export * from '#lib/shadcn/ui/spinner/spinner.svelte';
</script>

<script lang="ts">
	import Spinner from '#lib/shadcn/ui/spinner/spinner.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Spinner> = $props();
</script>

<Spinner {...props} />
