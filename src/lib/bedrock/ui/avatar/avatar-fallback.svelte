<script lang="ts" module>
	export * from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
</script>

<script lang="ts">
	import AvatarFallback from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof AvatarFallback> = $props();
</script>

<AvatarFallback {...props} />
