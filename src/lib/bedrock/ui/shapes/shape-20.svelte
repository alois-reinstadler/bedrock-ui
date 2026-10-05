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
		d="M 128 28 C 128 83.228 83.228 128 28 128 L 128 128 Z M 256 156 C 256 211.228 211.228 256 156 256 L 128 256 L 128 156 C 128 211.228 83.228 256 28 256 L 0 256 L 0 0 L 256 0 L 256 28 C 256 83.228 211.228 128 156 128 L 256 128 Z"
	/>
</svg>
