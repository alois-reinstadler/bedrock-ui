<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const headingVariants = tv({
		base: 'font-heading font-semibold tracking-tight',
		variants: {
			visual: {
				1: 'text-3xl',
				2: 'text-2xl',
				3: 'text-xl',
				4: 'text-lg',
				5: 'text-base',
				6: 'text-sm'
			},
			color: {
				default: 'text-foreground',
				muted: 'text-muted-foreground',
				accent: 'text-primary',
				destructive: 'text-destructive',
				inherit: ''
			},
			align: {
				start: 'text-start',
				center: 'text-center',
				end: 'text-end'
			},
			truncate: { true: 'truncate' }
		},
		defaultVariants: { color: 'default' }
	});

	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	export type HeadingVisual = HeadingLevel | 'display-1' | 'display-2' | 'display-3';
	export type HeadingColor = NonNullable<VariantProps<typeof headingVariants>['color']>;
	export type HeadingAlign = NonNullable<VariantProps<typeof headingVariants>['align']>;
</script>

<script lang="ts">
	import { textVariants } from '#lib/bedrock/ui/text';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * A semantic document heading. Never skip semantic levels; use `visual` when
	 * document hierarchy and appearance need to diverge.
	 */
	export type HeadingProps = WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
		level: HeadingLevel;
		visual?: HeadingVisual;
		accessibilityLevel?: HeadingLevel;
		color?: HeadingColor;
		align?: HeadingAlign;
		truncate?: boolean;
		/** Maximum visible lines. Takes precedence over `truncate`. */
		maxLines?: number;
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		style: styleProp,
		level,
		visual,
		accessibilityLevel,
		color = 'default',
		align,
		truncate = false,
		maxLines,
		children,
		...restProps
	}: HeadingProps = $props();

	const element = $derived(`h${level}` as const);
	const resolvedVisual = $derived(visual ?? level);
	const displayVisual = $derived(typeof resolvedVisual === 'string' ? resolvedVisual : undefined);
	const clampStyle = $derived(
		maxLines === undefined
			? styleProp
			: `${styleProp ? `${styleProp}; ` : ''}display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: ${maxLines}`
	);
</script>

<svelte:element
	this={element}
	bind:this={ref}
	data-slot="heading"
	aria-level={accessibilityLevel !== undefined && accessibilityLevel !== level
		? accessibilityLevel
		: undefined}
	class={cn(
		headingVariants({
			visual: typeof resolvedVisual === 'number' ? resolvedVisual : undefined,
			color,
			align,
			truncate: maxLines === undefined && truncate
		}),
		displayVisual && textVariants({ type: displayVisual, color: 'inherit' }),
		className
	)}
	style={clampStyle}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
