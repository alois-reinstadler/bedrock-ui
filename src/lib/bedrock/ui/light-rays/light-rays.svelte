<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { AnimationConfig, RaysColorConfig } from './runtime.js';
	export type LightRaysProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/** Spell UI intensity, from 0 to 100. */
		intensity?: number;
		/** Spell UI ray density, from 0 to 100. */
		rays?: number;
		/** How far the rays reach down the surface, from 0 to 100. */
		reach?: number;
		/** Horizontal ray origin, from 0 (left) to 100 (right). */
		position?: number;
		radius?: string;
		backgroundColor?: string;
		animation?: AnimationConfig;
		raysColor?: RaysColorConfig;
		paused?: boolean;
		/** Physical pixel budget, clamped to 10,000–4,000,000. */
		maxPixelCount?: number;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { createLightRaysRenderer } from './runtime.js';
	let {
		intensity = 13,
		rays = 32,
		reach = 16,
		position = 50,
		radius = '0px',
		backgroundColor = '#000',
		animation = { animate: true, speed: 10 },
		raysColor = { mode: 'single', color: '#639AFF' },
		paused = false,
		maxPixelCount = 1000000,
		children,
		class: className,
		...rest
	}: LightRaysProps = $props();
	const policy = useMotionPolicy();
	function render(node: HTMLDivElement) {
		const renderer = createLightRaysRenderer(node);
		function updateRenderer() {
			renderer.update({
				intensity,
				rays,
				reach,
				position,
				animation: { ...animation },
				raysColor: { ...raysColor },
				paused,
				reduced: policy.reduced,
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
	style:background-color={backgroundColor}
	style:border-radius={radius}
	data-slot="light-rays"
	data-requires="webgl2"
>
	<div
		{@attach render}
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 -z-10"
		data-renderer="fallback"
	></div>
	{#if children}{@render children()}{/if}
</div>
