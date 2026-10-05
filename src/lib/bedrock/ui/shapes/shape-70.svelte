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
		d="M 256 192 C 256 227.346 227.346 256 192 256 L 0 256 L 0 64 C 0 28.654 28.654 0 64 0 L 256 0 Z M 128 192 L 192 192 L 192 128 L 128 128 L 128 64 L 64 64 L 64 128 L 128 128 Z"
	/>
</svg>
