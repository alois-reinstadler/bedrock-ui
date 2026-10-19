<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
</script>

<script lang="ts">
	import AvatarFallback from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
	import type { ComponentProps } from 'svelte';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...props
	}: ComponentProps<typeof AvatarFallback> = $props();
</script>

<AvatarFallback bind:ref class={cn('text-foreground', className)} {...props} />
