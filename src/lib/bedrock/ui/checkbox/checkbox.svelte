<script lang="ts" module>
	export * from '#lib/shadcn/ui/checkbox/checkbox.svelte';
</script>

<script lang="ts">
	import Checkbox from '#lib/shadcn/ui/checkbox/checkbox.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox {...props} />
