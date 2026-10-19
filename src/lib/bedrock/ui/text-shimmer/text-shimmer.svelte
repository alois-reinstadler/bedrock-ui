<script lang="ts">
	import { pauseDecorative } from '#lib/bedrock/motion/decorative-visibility.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type TextShimmerProps = HTMLAttributes<HTMLSpanElement> & {
		duration?: number;
		paused?: boolean;
		color?: string;
		highlight?: string;
	};
	let {
		children,
		duration = 3,
		paused = false,
		color = 'var(--muted-foreground)',
		highlight = 'var(--foreground)',
		class: className,
		...rest
	}: TextShimmerProps = $props();
	const policy = useMotionPolicy();
</script>

<span
	{...rest}
	data-slot="text-shimmer"
	{@attach pauseDecorative}
	data-static={paused || policy.reduced}
	class={cn('shimmer', className)}
	style:--shimmer-duration={`${Math.max(0.1, duration)}s`}
	style:--shimmer-color={color}
	style:--shimmer-highlight={highlight}>{@render children?.()}</span
>

<style>
	.shimmer {
		color: var(--shimmer-color);
		background: linear-gradient(
			110deg,
			var(--shimmer-color) 35%,
			var(--shimmer-highlight) 50%,
			var(--shimmer-color) 65%
		);
		background-size: 250% 100%;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: shimmer var(--shimmer-duration) linear infinite;
		animation-play-state: var(--bedrock-decorative-play-state, paused);
	}
	.shimmer[data-static='true'] {
		animation: none;
		background: none;
		-webkit-text-fill-color: currentColor;
	}
	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -50% 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.shimmer {
			animation: none;
			background: none;
			-webkit-text-fill-color: currentColor;
		}
	}
	@media (forced-colors: active) {
		.shimmer {
			animation: none;
			background: none;
			color: CanvasText;
			-webkit-text-fill-color: currentColor;
		}
	}
</style>
