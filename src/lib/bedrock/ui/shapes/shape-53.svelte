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
		d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z"
	/>
</svg>
