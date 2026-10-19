<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
</script>

<script lang="ts">
	import AvatarGroupCount from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
	import type { ComponentProps } from 'svelte';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof AvatarGroupCount> = $props();
</script>

<AvatarGroupCount bind:ref class={cn('text-foreground', className)} {...props} />
