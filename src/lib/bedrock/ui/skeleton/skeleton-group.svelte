<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';
	import type { SkeletonVariant } from './skeleton.svelte';

	export type SkeletonGroupDirection = 'ltr' | 'rtl';
	export type SkeletonGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** Inherited by placeholders without an explicit variant. Defaults to shimmer. */
		variant?: SkeletonVariant;
		/** Duration of one shared shimmer sweep in milliseconds. Defaults to 2000. */
		duration?: number;
		/** Physical direction of the shared shimmer, independent of text direction. */
		direction?: SkeletonGroupDirection;
	};
</script>

<script lang="ts">
	import { pauseDecorative } from '#lib/bedrock/motion/decorative-visibility.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn } from '#lib/utils.js';
	import { createGroupGeometry } from './group-geometry';
	import { setSkeletonGroup } from './context';

	let {
		ref = $bindable(null),
		class: className,
		style,
		variant = 'shimmer',
		duration = 2000,
		direction = 'ltr',
		children,
		...restProps
	}: SkeletonGroupProps = $props();

	const policy = useMotionPolicy();
	const resolvedVariant = $derived(policy.reduced ? 'static' : variant);
	const geometry = createGroupGeometry();
	const resolvedDuration = $derived(Number.isFinite(duration) && duration > 0 ? duration : 2000);
	setSkeletonGroup({
		get variant() {
			return resolvedVariant;
		},
		register: geometry.register
	});

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
	{@attach pauseDecorative}
	{@attach resolvedVariant === 'shimmer' && geometry.attach}
	data-slot="skeleton-group"
	data-variant={resolvedVariant}
	data-reduced={policy.reduced}
	data-direction={direction}
	class={cn(
		'bedrock-skeleton-group',
		resolvedVariant === 'shimmer' &&
			'animate-[bedrock-skeleton-group_var(--skeleton-group-duration)_linear_infinite]',
		className
	)}
	style={`--skeleton-group-duration: ${resolvedDuration}ms; animation-direction: ${direction === 'rtl' ? 'reverse' : 'normal'}; ${style ?? ''}`}
>
	{@render children?.()}
</div>

<style>
	.bedrock-skeleton-group {
		animation-play-state: var(--bedrock-decorative-play-state, paused);
	}
	.bedrock-skeleton-group[data-reduced='true'] {
		animation: none !important;
	}
	@media (prefers-reduced-motion: reduce) {
		.bedrock-skeleton-group {
			animation: none !important;
		}
	}

	@property --bedrock-skeleton-progress {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}

	@layer components {
		.bedrock-skeleton-group {
			/* Nested groups own their timeline and measurements. */
			--bedrock-skeleton-progress: 0;
			--skeleton-group-width: 0px;
			--skeleton-group-height: 0px;
		}
	}

	@keyframes -global-bedrock-skeleton-group {
		from {
			--bedrock-skeleton-progress: 0;
		}
		to {
			--bedrock-skeleton-progress: 1;
		}
	}
</style>
