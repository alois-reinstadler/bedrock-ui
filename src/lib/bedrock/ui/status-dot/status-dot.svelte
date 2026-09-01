<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const statusDotVariants = tv({
		base: 'inline-block shrink-0 rounded-full',
		variants: {
			status: {
				neutral: 'bg-muted-foreground/60',
				success: 'bg-emerald-500',
				warning: 'bg-amber-500',
				destructive: 'bg-destructive',
				info: 'bg-sky-500'
			},
			size: {
				sm: 'size-1.5',
				default: 'size-2',
				lg: 'size-2.5'
			},
			pulse: {
				true: 'animate-pulse motion-reduce:animate-none',
				false: ''
			}
		},
		defaultVariants: { status: 'neutral', size: 'default', pulse: false }
	});

	export type StatusDotStatus = VariantProps<typeof statusDotVariants>['status'];
	export type StatusDotSize = VariantProps<typeof statusDotVariants>['size'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		status = 'neutral',
		size = 'default',
		pulse = false,
		label,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
		status?: StatusDotStatus;
		size?: StatusDotSize;
		pulse?: boolean;
		/** Screen-reader text describing the state, e.g. "Aktiv". */
		label?: string;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="status-dot"
	data-status={status}
	class={cn(statusDotVariants({ status, size, pulse }), className)}
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
	{...restProps}
></span>
