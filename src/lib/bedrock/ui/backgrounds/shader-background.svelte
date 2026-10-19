<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { BackgroundEffect } from './runtime.js';
	export type ShaderBackgroundProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Requires WebGL2. A static CSS gradient remains available without it. */
		effect?: BackgroundEffect;
		/** Hex colors only; up to ten for gradients and five for rays. */
		colors?: string[];
		speed?: number;
		paused?: boolean;
		intensity?: number;
		density?: number;
		distortion?: number;
		swirl?: number;
		grain?: number;
		/** Physical pixel budget, clamped to 10,000–4,000,000. */
		maxPixelCount?: number;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { backgroundColors, createBackgroundRenderer } from './runtime.js';
	let {
		effect: backgroundEffect = 'gradient',
		colors = ['#24243e', '#7065d8', '#e7a9a2'],
		speed = 0.35,
		paused = false,
		intensity = 0.75,
		density = 0.55,
		distortion = 0.4,
		swirl = 0.3,
		grain = 0.03,
		maxPixelCount = 1000000,
		children,
		class: className,
		...rest
	}: ShaderBackgroundProps = $props();
	const policy = useMotionPolicy();
	const fallback = $derived(backgroundColors(colors, backgroundEffect));
	function render(node: HTMLDivElement) {
		const renderer = createBackgroundRenderer(node);
		function updateRenderer() {
			renderer.update({
				effect: backgroundEffect,
				colors: [...colors],
				speed,
				paused,
				reduced: policy.reduced,
				intensity,
				density,
				distortion,
				swirl,
				grain,
				maxPixelCount
			});
		}
		$effect(updateRenderer);
		return () => renderer.dispose();
	}
</script>

<div
	{...rest}
	class={cn('relative isolate overflow-hidden', className)}
	data-slot="shader-background"
	data-requires="webgl2"
>
	{#key backgroundEffect}
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 -z-10"
			style:background={`linear-gradient(135deg, ${fallback.length === 1 ? `${fallback[0]}, ${fallback[0]}` : fallback.join(', ')})`}
		>
			<div {@attach render} class="absolute inset-0" data-renderer="fallback"></div>
		</div>
	{/key}
	{#if children}{@render children()}{/if}
</div>
