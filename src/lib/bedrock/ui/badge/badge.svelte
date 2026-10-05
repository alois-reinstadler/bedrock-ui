<script lang="ts" module>
	import { tv } from 'tailwind-variants';
	import { badgeVariants as primitiveBadgeVariants } from '#lib/shadcn/ui/badge/badge.svelte';
	export type { BadgeVariant } from '#lib/shadcn/ui/badge/badge.svelte';
	// Tinted status backgrounds need a dedicated text token in both themes.
	export const badgeVariants = tv({
		extend: primitiveBadgeVariants,
		variants: { variant: { destructive: 'text-destructive-ink' } }
	});
</script>

<script lang="ts">
	import Badge from '#lib/shadcn/ui/badge/badge.svelte';
	import type { ComponentProps } from 'svelte';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		variant = 'default',
		class: className,
		...props
	}: ComponentProps<typeof Badge> = $props();
</script>

<Badge bind:ref {variant} class={cn(badgeVariants({ variant }), className)} {...props} />
