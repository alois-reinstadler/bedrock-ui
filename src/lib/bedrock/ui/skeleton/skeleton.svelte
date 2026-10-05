<script lang="ts" module>
	import type { ComponentProps } from 'svelte';

	export type SkeletonVariant = 'pulse' | 'shimmer' | 'static';
	export type SkeletonProps = ComponentProps<typeof Skeleton> & {
		/** Pulse, shimmer, or static. Defaults to the group's variant, otherwise pulse. Reduced motion renders a static placeholder. */
		variant?: SkeletonVariant;
	};

	const variants: Record<SkeletonVariant, string> = {
		pulse: 'animate-pulse',
		shimmer: 'bedrock-skeleton-shimmer animate-[bedrock-skeleton-shimmer_2s_linear_infinite]',
		static: 'animate-none'
	};
</script>

<script lang="ts">
	import Skeleton from '#lib/shadcn/ui/skeleton/skeleton.svelte';
	import { pauseDecorative } from '#lib/bedrock/motion/decorative-visibility.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn } from '#lib/utils.js';
	import { getSkeletonGroup, hasSkeletonGroup } from './context';

	let { ref = $bindable(null), class: className, variant, ...restProps }: SkeletonProps = $props();

	const group = hasSkeletonGroup() ? getSkeletonGroup() : undefined;
	const policy = useMotionPolicy();
	const resolvedVariant = $derived(
		policy.reduced ? 'static' : (variant ?? group?.variant ?? 'pulse')
	);
	const grouped = $derived(resolvedVariant === 'shimmer' && group?.variant === 'shimmer');
</script>

<Skeleton
	{...restProps}
	bind:ref
	{@attach pauseDecorative}
	data-variant={resolvedVariant}
	data-reduced={policy.reduced}
	data-skeleton-grouped={grouped ? '' : undefined}
	class={cn(
		grouped
			? 'bedrock-skeleton-shimmer bedrock-skeleton-group-item animate-none'
			: variants[resolvedVariant],
		className
	)}
	{@attach grouped && group?.register}
/>

<style>
	/* Loading indicators respect application and OS reduction. */
	:global([data-slot='skeleton']) {
		animation-play-state: var(--bedrock-decorative-play-state, paused);
	}
	:global([data-slot='skeleton'][data-reduced='true']) {
		animation: none !important;
		background-image: none !important;
	}
	@media (prefers-reduced-motion: reduce) {
		:global([data-slot='skeleton']) {
			animation: none !important;
			background-image: none !important;
		}
	}
	@layer components {
		:global(.bedrock-skeleton-shimmer) {
			background-image: linear-gradient(
				110deg,
				transparent 40%,
				color-mix(in oklab, var(--muted-foreground) 14%, transparent) 50%,
				transparent 60%
			);
			background-size: 250% 100%;
			background-position: 100% 0;
			background-repeat: no-repeat;
		}

		:global(.bedrock-skeleton-group-item) {
			background-origin: border-box;
			background-size: calc(var(--skeleton-group-width) * 2.5) var(--skeleton-group-height);
			background-position: calc(
					var(--skeleton-group-width) * (var(--bedrock-skeleton-progress) - 1) * 1.5 -
						var(--skeleton-group-x, 0px)
				)
				calc(-1 * var(--skeleton-group-y, 0px));
		}
	}

	@keyframes -global-bedrock-skeleton-shimmer {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: 0% 0;
		}
	}
</style>
