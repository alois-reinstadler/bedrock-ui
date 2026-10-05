<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar.svelte';
</script>

<script lang="ts">
	import Avatar from '#lib/shadcn/ui/avatar/avatar.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		loadingStatus = $bindable('loading'),
		...props
	}: ComponentProps<typeof Avatar> = $props();
</script>

<Avatar bind:ref bind:loadingStatus {...props} />
