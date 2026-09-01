<script lang="ts" module>
	const defaultLabels = { opensInNewTab: '(opens in new tab)' };

	export type LinkLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		href,
		external = false,
		underline = true,
		color = 'accent',
		disabled = false,
		labels: labelOverrides = {},
		rel,
		target,
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		external?: boolean;
		underline?: boolean;
		color?: 'accent' | 'default' | 'muted' | 'inherit';
		disabled?: boolean;
		labels?: LinkLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const resolvedRel = $derived(
		external
			? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), 'noopener', 'noreferrer'])].join(
					' '
				)
			: rel
	);
</script>

<a
	bind:this={ref}
	data-slot="link"
	href={disabled ? undefined : href}
	target={external ? '_blank' : target}
	rel={resolvedRel}
	aria-disabled={disabled ? 'true' : undefined}
	class={cn(
		'rounded-xs motion-state focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
		underline ? 'underline underline-offset-3' : 'hover:underline',
		color === 'accent' && 'text-primary',
		color === 'default' && 'text-foreground',
		color === 'muted' && 'text-muted-foreground',
		color === 'inherit' && 'text-inherit',
		disabled && 'pointer-events-none opacity-50',
		className
	)}
	{...restProps}
>
	{@render children?.()}
	{#if external}
		<Icon icon="externalLink" class="ms-1 inline size-[0.85em] align-baseline" />
		<span class="sr-only"> {labels.opensInNewTab}</span>
	{/if}
</a>
