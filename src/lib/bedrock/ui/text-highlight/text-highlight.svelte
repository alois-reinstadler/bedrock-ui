<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type TextHighlightProps = HTMLAttributes<HTMLElement> & {
		variant?: 'highlight' | 'underline';
		animated?: boolean;
		duration?: number;
		color?: string;
	};
	let {
		children,
		variant = 'highlight',
		animated = false,
		duration = 0.7,
		color = 'color-mix(in oklch, var(--primary) 25%, transparent)',
		class: className,
		...rest
	}: TextHighlightProps = $props();
	const policy = useMotionPolicy();
	// Completing a one-shot under reduction must not replay it when preference changes back.
	function settleDrawing(node: HTMLElement) {
		if (policy.reduced) node.dataset.motionSettled = 'true';
	}
</script>

<mark
	{...rest}
	data-slot="text-highlight"
	{@attach settleDrawing}
	data-variant={variant}
	data-animated={animated && !policy.reduced}
	class={cn('highlight', className)}
	style:--highlight-duration={`${Math.max(0, duration)}s`}
	style:--highlight-color={color}>{@render children?.()}</mark
>

<style>
	.highlight {
		color: inherit;
		background: linear-gradient(var(--highlight-color), var(--highlight-color)) no-repeat left 85% /
			100% 75%;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		padding-inline: 0.08em;
	}
	.highlight[data-variant='underline'] {
		background-size: 100% 0.12em;
		background-position: left 100%;
	}
	.highlight[data-animated='true'] {
		animation: highlight var(--highlight-duration) ease-out both;
	}
	.highlight[data-motion-settled='true'] {
		animation: none;
	}
	@keyframes highlight {
		from {
			background-size: 0 75%;
		}
		to {
			background-size: 100% 75%;
		}
	}
	.highlight[data-variant='underline'][data-animated='true'] {
		animation-name: underline;
	}
	@keyframes underline {
		from {
			background-size: 0 0.12em;
		}
		to {
			background-size: 100% 0.12em;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.highlight[data-animated='true'] {
			animation: none;
		}
	}
	@media (forced-colors: active) {
		.highlight {
			background: Mark;
			color: MarkText;
		}
	}
</style>
