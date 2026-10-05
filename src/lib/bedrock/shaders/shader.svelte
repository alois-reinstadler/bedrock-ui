<script lang="ts" generics="T extends ShaderId">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { getShader, type ShaderId } from './catalog.js';
	import { createShaderRenderer } from './runtime.js';
	import type { ShaderOptions, ShaderState } from './types.js';
	let {
		effect: shaderEffect,
		text,
		src,
		alt = '',
		options = {},
		speed,
		paused = false,
		maxPixelCount = 1000000,
		showStatus = false,
		children,
		class: className,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		effect: T;
		text?: string;
		src?: string;
		alt?: string;
		options?: ShaderOptions[T];
		speed?: number;
		paused?: boolean;
		maxPixelCount?: number;
		showStatus?: boolean;
		children?: Snippet;
	} = $props();
	const policy = useMotionPolicy();
	let state = $state<ShaderState>('loading');
	let definition = $derived(getShader(shaderEffect)!);
	function render(node: HTMLDivElement) {
		const renderer = createShaderRenderer(node, (next) => {
			state = next;
		});
		function updateRenderer() {
			renderer.update({
				effect: shaderEffect,
				text,
				src,
				speed,
				paused,
				reduced: policy.reduced,
				maxPixelCount,
				options: { ...options }
			});
		}
		$effect(updateRenderer);
		return () => renderer.dispose();
	}
</script>

<div
	{...rest}
	class={cn('relative isolate overflow-hidden', className)}
	style:background={definition.fallback}
	data-slot="shader"
	data-effect={shaderEffect}
	data-state={state}
>
	{#if src && text === undefined}
		<img
			{src}
			{alt}
			class="absolute inset-0 h-full w-full object-cover"
			class:opacity-0={state === 'ready'}
		/>
	{/if}
	{#if text !== undefined}
		<span
			class={state === 'ready'
				? 'sr-only'
				: 'absolute inset-0 grid place-items-center px-6 text-center text-5xl font-extrabold tracking-tighter break-all text-white sm:text-7xl'}
			>{text}</span
		>
	{/if}
	<div {@attach render} aria-hidden="true" class="pointer-events-none absolute inset-0"></div>
	<div class="relative">
		{#if children}{@render children()}{/if}
	</div>
	{#if showStatus && state !== 'ready'}
		<span
			class="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm"
		>
			{state === 'unsupported'
				? 'Static preview · WebGL2 unavailable'
				: state === 'error'
					? 'Effect unavailable · source shown'
					: 'Loading shader'}
		</span>
	{/if}
</div>
