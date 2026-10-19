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
		d="M 28 0 C 83.228 0 128 44.772 128 100 C 128 44.772 172.772 0 228 0 L 256 0 L 256 156 C 256 211.228 211.228 256 156 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 0 Z"
	/>
</svg>
