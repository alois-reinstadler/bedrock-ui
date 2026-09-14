<script lang="ts" module>
	export type ScrollAreaEdgeBlur = false | 'vertical' | 'horizontal' | 'both';
</script>

<script lang="ts">
	import { ProgressiveBlur } from '#lib/bedrock/ui/progressive-blur';
	import { cn, type WithoutChild } from '#lib/utils.js';
	import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
	import { onMount, tick } from 'svelte';
	import { Scrollbar } from './index.js';

	let {
		ref = $bindable(null),
		viewportRef = $bindable(null),
		class: className,
		orientation = 'vertical',
		scrollbarXClasses = '',
		scrollbarYClasses = '',
		edgeBlur = false,
		edgeBlurSize = 48,
		edgeBlurStrength = 14,
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.RootProps> & {
		orientation?: 'vertical' | 'horizontal' | 'both';
		scrollbarXClasses?: string;
		scrollbarYClasses?: string;
		viewportRef?: HTMLElement | null;
		edgeBlur?: ScrollAreaEdgeBlur;
		edgeBlurSize?: number | string;
		edgeBlurStrength?: number;
	} = $props();

	onMount(() => {
		let disposed = false;
		let cleanup: (() => void) | undefined;

		void tick().then(() => {
			const viewport = viewportRef;
			const root = ref;
			if (disposed || !viewport || !root || !edgeBlur) return;

			const update = () => {
				const x = Math.abs(viewport.scrollLeft);
				root.dataset.scrollVerticalStart = String(viewport.scrollTop > 1);
				root.dataset.scrollVerticalEnd = String(
					viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 1
				);
				root.dataset.scrollHorizontalStart = String(x > 1);
				root.dataset.scrollHorizontalEnd = String(
					x + viewport.clientWidth < viewport.scrollWidth - 1
				);
			};

			const resizeObserver = new ResizeObserver(update);
			resizeObserver.observe(viewport);
			if (viewport.firstElementChild) resizeObserver.observe(viewport.firstElementChild);
			viewport.addEventListener('scroll', update, { passive: true });
			update();
			cleanup = () => {
				resizeObserver.disconnect();
				viewport.removeEventListener('scroll', update);
			};
		});

		return () => {
			disposed = true;
			cleanup?.();
		};
	});
</script>

<ScrollAreaPrimitive.Root
	bind:ref
	data-slot="scroll-area"
	data-edge-blur={edgeBlur || undefined}
	class={cn('relative', className)}
	{...restProps}
>
	<ScrollAreaPrimitive.Viewport
		bind:ref={viewportRef}
		data-slot="scroll-area-viewport"
		class="cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
	>
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>
	{#if orientation === 'vertical' || orientation === 'both'}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />

	{#if edgeBlur === 'vertical' || edgeBlur === 'both'}
		<ProgressiveBlur
			orientation="vertical"
			edge="start"
			data-scroll-edge="vertical-start"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
		<ProgressiveBlur
			orientation="vertical"
			edge="end"
			data-scroll-edge="vertical-end"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
	{/if}
	{#if edgeBlur === 'horizontal' || edgeBlur === 'both'}
		<ProgressiveBlur
			orientation="horizontal"
			edge="start"
			data-scroll-edge="horizontal-start"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
		<ProgressiveBlur
			orientation="horizontal"
			edge="end"
			data-scroll-edge="horizontal-end"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
	{/if}
</ScrollAreaPrimitive.Root>

<style>
	:global([data-slot='scroll-area'] > [data-scroll-edge]) {
		opacity: 0;
	}

	:global(
		[data-slot='scroll-area'][data-scroll-vertical-start='true']
			> [data-scroll-edge='vertical-start']
	) {
		opacity: 1;
	}

	:global(
		[data-slot='scroll-area'][data-scroll-vertical-end='true'] > [data-scroll-edge='vertical-end']
	) {
		opacity: 1;
	}

	:global(
		[data-slot='scroll-area'][data-scroll-horizontal-start='true']
			> [data-scroll-edge='horizontal-start']
	) {
		opacity: 1;
	}

	:global(
		[data-slot='scroll-area'][data-scroll-horizontal-end='true']
			> [data-scroll-edge='horizontal-end']
	) {
		opacity: 1;
	}
</style>
