<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	let {
		opacity = 0.08,
		scale = 180,
		class: className,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		opacity?: number;
		scale?: number;
	} = $props();
	const texture = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" seed="7"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="1"/></svg>')}")`;
</script>

<div
	{...rest}
	aria-hidden="true"
	data-slot="noise-overlay"
	class={cn('pointer-events-none absolute inset-0', className)}
	style:background-image={texture}
	style:background-size={`${Math.max(24, scale)}px ${Math.max(24, scale)}px`}
	style:opacity={Math.min(1, Math.max(0, opacity))}
></div>
