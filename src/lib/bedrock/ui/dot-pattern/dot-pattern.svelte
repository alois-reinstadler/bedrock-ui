<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	let {
		spacing = 20,
		size = 1,
		color = 'currentColor',
		opacity = 0.2,
		fade = true,
		variant = 'default',
		class: className,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		spacing?: number;
		size?: number;
		color?: string;
		opacity?: number;
		fade?: boolean;
		/** Subtle lowers contrast without adding a second component. */
		variant?: 'default' | 'subtle';
	} = $props();
</script>

<div
	{...rest}
	aria-hidden="true"
	data-slot="dot-pattern"
	class={cn('pointer-events-none absolute inset-0', className)}
	style:background-image={`radial-gradient(${color} ${Math.max(0.25, size)}px, transparent ${Math.max(0.25, size)}px)`}
	style:background-size={`${Math.max(4, spacing)}px ${Math.max(4, spacing)}px`}
	style:opacity={Math.min(1, Math.max(0, opacity)) * (variant === 'subtle' ? 0.45 : 1)}
	style:mask-image={fade
		? 'radial-gradient(ellipse at center, black 25%, transparent 75%)'
		: undefined}
></div>
