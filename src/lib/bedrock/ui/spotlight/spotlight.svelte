<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { useSpotlight, type SpotlightPoint } from './context.js';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type SpotlightProps = HTMLAttributes<HTMLDivElement> & {
		radius?: number;
		color?: string;
		fill?: boolean;
		border?: boolean;
		disabled?: boolean;
	};
	let {
		children,
		radius = 260,
		color = 'var(--primary)',
		fill = true,
		border = true,
		disabled = false,
		class: className,
		...rest
	}: SpotlightProps = $props();
	const group = useSpotlight();
	const policy = useMotionPolicy();
	const pointer: Attachment<HTMLDivElement> = (node) => {
		node.style.setProperty('--spot-active', '0');
		if (disabled || policy.reduced) return;
		const update = (point: SpotlightPoint) => {
			node.style.setProperty('--spot-active', point ? '1' : '0');
			if (point) {
				const rect = node.getBoundingClientRect();
				node.style.setProperty('--spot-x', `${point.x - rect.left}px`);
				node.style.setProperty('--spot-y', `${point.y - rect.top}px`);
			}
		};
		if (group) return group.register(update);
		const move = (event: PointerEvent) => {
			if (event.pointerType === 'mouse') update({ x: event.clientX, y: event.clientY });
			else update(null);
		};
		const leave = () => update(null);
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', leave);
		node.addEventListener('pointercancel', leave);
		window.addEventListener('scroll', leave, true);
		window.addEventListener('blur', leave);
		node.addEventListener('focusin', leave);
		return () => {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
			node.removeEventListener('pointercancel', leave);
			window.removeEventListener('scroll', leave, true);
			window.removeEventListener('blur', leave);
			node.removeEventListener('focusin', leave);
		};
	};
</script>

<div
	{...rest}
	data-slot="spotlight"
	data-reduced={policy.reduced}
	class={cn('spotlight relative isolate rounded-xl border bg-card text-card-foreground', className)}
	style:--spot-radius={`${Math.max(1, radius)}px`}
	style:--spot-color={color}
	{@attach pointer}
>
	{#if fill}<div aria-hidden="true" class="glow fill"></div>{/if}
	{#if border}<div aria-hidden="true" class="glow border-glow"></div>{/if}
	<div class="relative z-10 h-full">{@render children?.()}</div>
</div>

<style>
	.spotlight {
		--spot-active: 0;
		--spot-x: 50%;
		--spot-y: 50%;
	}
	.glow {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: var(--spot-active);
		background: radial-gradient(
			var(--spot-radius) circle at var(--spot-x) var(--spot-y),
			var(--spot-color),
			transparent 75%
		);
		transition: opacity var(--motion-state, 175ms) var(--motion-ease-enter, ease-out);
	}
	.fill {
		opacity: calc(var(--spot-active) * 0.12);
	}
	.border-glow {
		inset: -1px;
		padding: 1px;
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
	}
	[data-reduced='true'] .glow {
		transition: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.glow {
			display: none;
		}
	}
</style>
