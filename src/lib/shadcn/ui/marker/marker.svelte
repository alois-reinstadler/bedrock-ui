<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const markerVariants = tv({
		base: "gap-2 text-sm text-muted-foreground [a]:hover:text-foreground [a]:underline-offset-3 [a]:underline [&_svg:not([class*='size-'])]:size-4 min-h-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm group/marker relative flex w-full items-center",
		variants: {
			variant: {
				default: '',
				separator:
					'before:h-px before:min-w-0 before:flex-1 before:bg-border after:h-px after:min-w-0 after:flex-1 after:bg-border before:mr-1 after:ml-1',
				border: 'border-b border-border pb-2'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type MarkerVariant = VariantProps<typeof markerVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { createAttachmentKey } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		child,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: MarkerVariant;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
	} = $props();

	const refKey = createAttachmentKey();
	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
	const mergedProps = $derived({
		[refKey]: attachRef,
		class: cn(markerVariants({ variant }), className),
		'data-slot': 'marker',
		'data-variant': variant,
		...restProps
	});
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render mergedProps.children?.()}
	</div>
{/if}
