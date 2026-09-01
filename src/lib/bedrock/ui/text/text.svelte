<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	/**
	 * Semantic text styles. Display types are for decorative or data callouts and do not
	 * provide heading semantics; use Heading for document structure.
	 */
	export const textVariants = tv({
		variants: {
			type: {
				body: 'text-sm',
				large: 'text-base',
				label: 'text-sm font-medium',
				supporting: 'text-xs text-muted-foreground',
				code: 'font-code text-sm',
				'display-1': 'text-6xl font-semibold tracking-tight',
				'display-2': 'text-5xl font-semibold tracking-tight',
				'display-3': 'text-4xl font-semibold tracking-tight'
			},
			color: {
				default: 'text-foreground',
				muted: 'text-muted-foreground',
				accent: 'text-primary',
				destructive: 'text-destructive',
				inherit: ''
			},
			weight: {
				normal: 'font-normal',
				medium: 'font-medium',
				semibold: 'font-semibold',
				bold: 'font-bold'
			},
			align: {
				start: 'text-start',
				center: 'text-center',
				end: 'text-end'
			},
			truncate: { true: 'truncate' },
			tabularNums: { true: 'tabular-nums' }
		},
		defaultVariants: { type: 'body', color: 'default' }
	});

	export type TextType = NonNullable<VariantProps<typeof textVariants>['type']>;
	export type TextColor = NonNullable<VariantProps<typeof textVariants>['color']>;
	export type TextWeight = NonNullable<VariantProps<typeof textVariants>['weight']>;
	export type TextAlign = NonNullable<VariantProps<typeof textVariants>['align']>;
	export type TextElement = 'span' | 'p' | 'div' | 'label';
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TextProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
		type?: TextType;
		as?: TextElement;
		/** Forwarded to the rendered element when `as="label"`. */
		for?: string;
		color?: TextColor;
		weight?: TextWeight;
		align?: TextAlign;
		truncate?: boolean;
		/** Maximum visible lines. Takes precedence over `truncate`. */
		maxLines?: number;
		tabularNums?: boolean;
		children?: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		style: styleProp,
		type = 'body',
		as = 'span',
		color: colorOverride,
		weight,
		align,
		truncate = false,
		maxLines,
		tabularNums = false,
		children,
		...restProps
	}: TextProps = $props();

	const color = $derived(colorOverride ?? (type === 'supporting' ? 'muted' : 'default'));
	const clampStyle = $derived(
		maxLines === undefined
			? styleProp
			: `${styleProp ? `${styleProp}; ` : ''}display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: ${maxLines}`
	);
</script>

<svelte:element
	this={as}
	bind:this={ref}
	data-slot="text"
	class={cn(
		textVariants({
			type,
			color,
			weight,
			align,
			truncate: maxLines === undefined && truncate,
			tabularNums
		}),
		className
	)}
	style={clampStyle}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
