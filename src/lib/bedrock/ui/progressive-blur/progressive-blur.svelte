<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type ProgressiveBlurOrientation = 'vertical' | 'horizontal';
	export type ProgressiveBlurEdge = 'start' | 'end';
	export type ProgressiveBlurSide = 'top' | 'right' | 'bottom' | 'left';

	export type ProgressiveBlurProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** The physical edge the blur grows from. Takes precedence over orientation and edge. */
		side?: ProgressiveBlurSide;
		/** @deprecated Prefer side. Retained for backward compatibility. */
		orientation?: ProgressiveBlurOrientation;
		/** @deprecated Prefer side. Retained for backward compatibility. */
		edge?: ProgressiveBlurEdge;
		size?: number | string;
		strength?: number;
		visible?: boolean;
	};

	let {
		ref = $bindable(null),
		side,
		orientation = 'vertical',
		edge = 'end',
		size = 64,
		strength = 16,
		visible = true,
		class: className,
		style: styleProp,
		...restProps
	}: ProgressiveBlurProps = $props();

	const layers = [
		{ factor: 0.12, solid: '0%', fade: '100%' },
		{ factor: 0.26, solid: '4%', fade: '82%' },
		{ factor: 0.46, solid: '8%', fade: '64%' },
		{ factor: 0.7, solid: '12%', fade: '48%' },
		{ factor: 1, solid: '16%', fade: '34%' }
	] as const;

	const resolvedSide = $derived<ProgressiveBlurSide>(
		side ??
			(orientation === 'vertical'
				? edge === 'start'
					? 'top'
					: 'bottom'
				: edge === 'start'
					? 'left'
					: 'right')
	);
	const resolvedOrientation = $derived<ProgressiveBlurOrientation>(
		resolvedSide === 'top' || resolvedSide === 'bottom' ? 'vertical' : 'horizontal'
	);
	const resolvedEdge = $derived<ProgressiveBlurEdge>(
		resolvedSide === 'top' || resolvedSide === 'left' ? 'start' : 'end'
	);
	const resolvedSize = $derived(typeof size === 'number' ? `${Math.max(0, size)}px` : size);
	const resolvedStrength = $derived(Number.isFinite(strength) ? Math.max(0, strength) : 16);
	const resolvedStyle = $derived(
		`--progressive-blur-size: ${resolvedSize}; --progressive-blur-strength: ${resolvedStrength}px;${styleProp ? ` ${styleProp}` : ''}`
	);

	function attachRef(node: HTMLDivElement) {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}
</script>

<div
	{...restProps}
	{@attach attachRef}
	data-slot="progressive-blur"
	data-side={resolvedSide}
	data-orientation={resolvedOrientation}
	data-edge={resolvedEdge}
	data-visible={visible}
	aria-hidden="true"
	class={cn(
		'pointer-events-none absolute isolate z-10 overflow-hidden',
		resolvedOrientation === 'vertical'
			? 'inset-x-0 h-(--progressive-blur-size)'
			: 'inset-y-0 w-(--progressive-blur-size)',
		className
	)}
	style={resolvedStyle}
>
	<span data-blur-fallback></span>
	{#each layers as layer, index (`${layer.factor}-${layer.fade}`)}
		<span
			data-blur-layer={index + 1}
			style={`--progressive-blur-factor: ${layer.factor}; --progressive-blur-solid: ${layer.solid}; --progressive-blur-fade: ${layer.fade};`}
		></span>
	{/each}
</div>

<style>
	[data-slot='progressive-blur'] {
		contain: paint;
		pointer-events: none;
		--progressive-blur-direction: to top;
	}

	/* Protect controls sharing this decorative layer's positioned parent. */
	:global(*:focus-within > [data-slot='progressive-blur']) {
		--progressive-blur-opacity: 0;
		--progressive-blur-duration: 0s;
	}

	[data-visible='false'] {
		--progressive-blur-opacity: 0;
	}

	[data-side='top'] {
		top: 0;
		--progressive-blur-direction: to bottom;
	}

	[data-side='right'] {
		right: 0;
		--progressive-blur-direction: to left;
	}

	[data-side='bottom'] {
		bottom: 0;
		--progressive-blur-direction: to top;
	}

	[data-side='left'] {
		left: 0;
		--progressive-blur-direction: to right;
	}

	/* Fade each filtered surface, never its parent: opacity below 1 on an
	   ancestor creates a backdrop root and clips sampling to that ancestor. */
	[data-blur-layer],
	[data-blur-fallback] {
		position: absolute;
		inset: -1px;
		opacity: var(--progressive-blur-opacity, 1);
		transition: opacity var(--progressive-blur-duration, var(--motion-state, 160ms))
			var(--motion-ease-enter, ease-out);
	}

	[data-blur-fallback] {
		display: none;
		background: linear-gradient(
			var(--progressive-blur-direction),
			var(--progressive-blur-fallback, var(--background)) 0%,
			transparent 100%
		);
	}

	[data-blur-layer] {
		-webkit-backdrop-filter: blur(
			calc(var(--progressive-blur-strength) * var(--progressive-blur-factor))
		);
		backdrop-filter: blur(calc(var(--progressive-blur-strength) * var(--progressive-blur-factor)));
		-webkit-mask-image: linear-gradient(
			var(--progressive-blur-direction),
			black 0%,
			black var(--progressive-blur-solid),
			transparent var(--progressive-blur-fade)
		);
		mask-image: linear-gradient(
			var(--progressive-blur-direction),
			black 0%,
			black var(--progressive-blur-solid),
			transparent var(--progressive-blur-fade)
		);
	}

	@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
		[data-blur-fallback] {
			display: block;
		}

		[data-blur-layer] {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-blur-layer],
		[data-blur-fallback] {
			transition: none;
		}
	}

	@media (forced-colors: active) {
		[data-slot='progressive-blur'] {
			display: none;
		}
	}
</style>
