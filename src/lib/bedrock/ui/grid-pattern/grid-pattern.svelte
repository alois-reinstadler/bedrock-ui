<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	let {
		spacing = 32,
		lineWidth = 1,
		color = 'currentColor',
		opacity = 0.1,
		fade = true,
		class: className,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		spacing?: number;
		lineWidth?: number;
		color?: string;
		opacity?: number;
		fade?: boolean;
	} = $props();
</script>

<div
	{...rest}
	aria-hidden="true"
	data-slot="grid-pattern"
	class={cn('pointer-events-none absolute inset-0', className)}
	style:background-image={`linear-gradient(${color} ${Math.max(0.25, lineWidth)}px, transparent ${Math.max(0.25, lineWidth)}px), linear-gradient(90deg, ${color} ${Math.max(0.25, lineWidth)}px, transparent ${Math.max(0.25, lineWidth)}px)`}
	style:background-size={`${Math.max(4, spacing)}px ${Math.max(4, spacing)}px`}
	style:opacity={Math.min(1, Math.max(0, opacity))}
	style:mask-image={fade
		? 'radial-gradient(ellipse at center, black 25%, transparent 75%)'
		: undefined}
></div>
