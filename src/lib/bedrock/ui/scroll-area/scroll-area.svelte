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
		edgeBlurSize = 64,
		edgeBlurStrength = 16,
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

	function setScrollState(root: HTMLElement, viewport: HTMLElement, mode: ScrollAreaEdgeBlur) {
		const verticalEnabled = mode === 'vertical' || mode === 'both';
		const horizontalEnabled = mode === 'horizontal' || mode === 'both';
		const verticalOverflow = viewport.scrollHeight > viewport.clientHeight + 1;
		const horizontalOverflow = viewport.scrollWidth > viewport.clientWidth + 1;
		const maxX = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
		const x = Math.min(maxX, Math.abs(viewport.scrollLeft));
		const isRtl = getComputedStyle(viewport).direction === 'rtl';

		const topHidden = verticalEnabled && verticalOverflow && viewport.scrollTop > 1;
		const bottomHidden =
			verticalEnabled &&
			verticalOverflow &&
			viewport.scrollTop + viewport.clientHeight < viewport.scrollHeight - 1;
		const leftHidden = horizontalEnabled && horizontalOverflow && (isRtl ? x < maxX - 1 : x > 1);
		const rightHidden = horizontalEnabled && horizontalOverflow && (isRtl ? x > 1 : x < maxX - 1);

		root.dataset.overflowVertical = String(verticalOverflow);
		root.dataset.overflowHorizontal = String(horizontalOverflow);
		root.dataset.scrollTopHidden = String(topHidden);
		root.dataset.scrollBottomHidden = String(bottomHidden);
		root.dataset.scrollLeftHidden = String(leftHidden);
		root.dataset.scrollRightHidden = String(rightHidden);
	}

	function clearScrollState(root: HTMLElement) {
		root.dataset.overflowVertical = 'false';
		root.dataset.overflowHorizontal = 'false';
		root.dataset.scrollTopHidden = 'false';
		root.dataset.scrollBottomHidden = 'false';
		root.dataset.scrollLeftHidden = 'false';
		root.dataset.scrollRightHidden = 'false';
	}

	onMount(() => {
		let disposed = false;
		let cleanup: (() => void) | undefined;

		void tick().then(() => {
			const root = ref;
			const viewport = viewportRef;
			if (disposed || !root || !viewport) return;

			const update = () => {
				if (edgeBlur) setScrollState(root, viewport, edgeBlur);
				else clearScrollState(root);
			};
			const resizeObserver = new ResizeObserver(update);
			let observedChildren: Element[] = [];
			const observeChildren = () => {
				for (const child of observedChildren) {
					if (child.parentElement !== viewport) {
						resizeObserver.unobserve(child);
					}
				}
				for (const child of viewport.children) {
					if (observedChildren.includes(child)) continue;
					resizeObserver.observe(child);
				}
				observedChildren = Array.from(viewport.children);
			};
			const mutationObserver = new MutationObserver((records) => {
				// Only a replaced direct content wrapper changes resize subscriptions.
				// Nested async content can change overflow without resizing that wrapper.
				if (records.some((record) => record.type === 'childList' && record.target === viewport)) {
					observeChildren();
				}
				update();
			});

			resizeObserver.observe(viewport);
			observeChildren();
			mutationObserver.observe(viewport, {
				childList: true,
				characterData: true,
				subtree: true
			});
			mutationObserver.observe(root, { attributeFilter: ['data-edge-blur', 'dir'] });
			viewport.addEventListener('scroll', update, { passive: true });
			update();

			cleanup = () => {
				resizeObserver.disconnect();
				mutationObserver.disconnect();
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
	class={cn('relative overflow-hidden', className)}
	{...restProps}
>
	<ScrollAreaPrimitive.Viewport
		bind:ref={viewportRef}
		data-slot="scroll-area-viewport"
		class="cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
	>
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>

	{#if edgeBlur === 'vertical' || edgeBlur === 'both'}
		<ProgressiveBlur
			side="top"
			data-scroll-edge="top"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
		<ProgressiveBlur
			side="bottom"
			data-scroll-edge="bottom"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
	{/if}
	{#if edgeBlur === 'horizontal' || edgeBlur === 'both'}
		<ProgressiveBlur
			side="left"
			data-scroll-edge="left"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
		<ProgressiveBlur
			side="right"
			data-scroll-edge="right"
			size={edgeBlurSize}
			strength={edgeBlurStrength}
		/>
	{/if}

	{#if orientation === 'vertical' || orientation === 'both'}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>

<style>
	:global([data-slot='scroll-area'] > [data-scroll-edge]) {
		--progressive-blur-opacity: 0;
	}

	:global([data-slot='scroll-area'][data-scroll-top-hidden='true'] > [data-scroll-edge='top']),
	:global(
		[data-slot='scroll-area'][data-scroll-bottom-hidden='true'] > [data-scroll-edge='bottom']
	),
	:global([data-slot='scroll-area'][data-scroll-left-hidden='true'] > [data-scroll-edge='left']),
	:global([data-slot='scroll-area'][data-scroll-right-hidden='true'] > [data-scroll-edge='right']) {
		--progressive-blur-opacity: 1;
	}

	/* A focused control must never sit underneath a decorative blur. */
	:global([data-slot='scroll-area']:focus-within > [data-scroll-edge]) {
		--progressive-blur-opacity: 0;
		--progressive-blur-duration: 0s;
	}
</style>
