<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '#lib/utils.js';
	import type { ShapeProps } from './types.js';
	let { ref = $bindable(null), label, class: className, ...restProps }: ShapeProps = $props();
</script>

<svg
	{@attach (node: SVGSVGElement) => {
		if (untrack(() => ref) !== node) ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 256 256"
	fill="currentColor"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : true}
	focusable="false"
	data-slot="shape"
	class={cn('size-24 shrink-0', className)}
	{...restProps}
>
	<path
		d="M 256 156 C 256 211.228 211.228 256 156 256 L 0 256 L 0 100 C 0 44.772 44.772 0 100 0 L 256 0 Z M 106 16 C 56.294 16 16 56.294 16 106 L 16 150 C 16 199.706 56.294 240 106 240 L 150 240 C 199.706 240 240 199.706 240 150 L 240 106 C 240 56.294 199.706 16 150 16 Z"
	/>
</svg>
