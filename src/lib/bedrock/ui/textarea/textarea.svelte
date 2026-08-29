<script lang="ts" module>
	export * from '#lib/shadcn/ui/textarea/textarea.svelte';
</script>

<script lang="ts">
	import Textarea from '#lib/shadcn/ui/textarea/textarea.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea {...props} />
