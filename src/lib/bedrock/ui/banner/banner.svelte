<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const bannerVariants = tv({
		base: "bedrock-banner flex w-full items-center gap-3 border-b px-4 py-2.5 text-sm *:[svg]:shrink-0 *:[svg:not([class*='size-'])]:size-4",
		variants: {
			variant: {
				info: 'border-border bg-muted text-foreground',
				success: 'border-emerald-600/20 bg-emerald-500/10 text-foreground *:[svg]:text-emerald-600',
				warning: 'border-amber-600/20 bg-amber-500/10 text-foreground *:[svg]:text-amber-600',
				destructive:
					'border-destructive/20 bg-destructive/10 text-foreground *:[svg]:text-destructive'
			}
		},
		defaultVariants: { variant: 'info' }
	});

	export type BannerVariant = VariantProps<typeof bannerVariants>['variant'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'info',
		motion = 'none',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** Opt in only for a newly inserted item, never initial/history content. */
		motion?: 'none' | 'enter';
		variant?: BannerVariant;
	} = $props();
	const policy = useMotionPolicy();
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="banner"
	data-entry={motion === 'enter' && variant !== 'warning' && variant !== 'destructive'}
	{@attach policy.attach}
	role={variant === 'destructive' || variant === 'warning' ? 'alert' : 'status'}
	class={cn(bannerVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.bedrock-banner[data-entry='true'] {
		transition:
			translate var(--motion-enter) var(--motion-ease-enter),
			opacity var(--motion-enter) var(--motion-ease-enter);
	}

	@starting-style {
		.bedrock-banner[data-entry='true'] {
			translate: 0 -0.5rem;
			opacity: 0;
		}
	}
</style>
