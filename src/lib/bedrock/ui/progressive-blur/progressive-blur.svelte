<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type ProgressiveBlurOrientation = 'vertical' | 'horizontal';
	export type ProgressiveBlurEdge = 'start' | 'end';

	export type ProgressiveBlurProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		orientation?: ProgressiveBlurOrientation;
		edge?: ProgressiveBlurEdge;
		size?: number | string;
		strength?: number;
		visible?: boolean;
	};

	let {
		ref = $bindable(null),
		orientation = 'vertical',
		edge = 'end',
		size = 48,
		strength = 14,
		visible = true,
		class: className,
		style: styleProp,
		...restProps
	}: ProgressiveBlurProps = $props();

	const resolvedSize = $derived(typeof size === 'number' ? `${size}px` : size);
	const resolvedStyle = $derived(
		`--progressive-blur-size: ${resolvedSize}; --progressive-blur-strength: ${strength}px;${styleProp ? ` ${styleProp}` : ''}`
	);

	function attachRef(node: HTMLDivElement) {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}
</script>

<div
	{@attach attachRef}
	data-slot="progressive-blur"
	data-orientation={orientation}
	data-edge={edge}
	data-visible={visible}
	aria-hidden="true"
	class={cn(
		'pointer-events-none absolute z-10 transition-opacity duration-(--motion-state) ease-(--motion-ease-enter)',
		orientation === 'vertical'
			? 'inset-x-0 h-(--progressive-blur-size)'
			: 'inset-y-0 w-(--progressive-blur-size)',
		!visible && 'opacity-0',
		className
	)}
	style={resolvedStyle}
	{...restProps}
></div>

<style>
	[data-slot='progressive-blur'] {
		background: color-mix(in oklab, var(--background) 8%, transparent);
		-webkit-backdrop-filter: blur(var(--progressive-blur-strength));
		backdrop-filter: blur(var(--progressive-blur-strength));
	}

	[data-orientation='vertical'][data-edge='start'] {
		top: 0;
		-webkit-mask-image: linear-gradient(to bottom, black, transparent);
		mask-image: linear-gradient(to bottom, black, transparent);
	}

	[data-orientation='vertical'][data-edge='end'] {
		bottom: 0;
		-webkit-mask-image: linear-gradient(to top, black, transparent);
		mask-image: linear-gradient(to top, black, transparent);
	}

	[data-orientation='horizontal'][data-edge='start'] {
		left: 0;
		-webkit-mask-image: linear-gradient(to right, black, transparent);
		mask-image: linear-gradient(to right, black, transparent);
	}

	[data-orientation='horizontal'][data-edge='end'] {
		right: 0;
		-webkit-mask-image: linear-gradient(to left, black, transparent);
		mask-image: linear-gradient(to left, black, transparent);
	}
</style>
