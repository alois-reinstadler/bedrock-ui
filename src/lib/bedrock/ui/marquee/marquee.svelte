<script lang="ts">
	import { pauseDecorative } from '#lib/bedrock/motion/decorative-visibility.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
		vertical?: boolean;
		reverse?: boolean;
		speed?: number;
		gap?: number;
		fade?: boolean;
		pauseOnHover?: boolean;
		paused?: boolean;
		controls?: boolean;
		pauseLabel?: string;
		resumeLabel?: string;
	};
	let {
		children,
		vertical = false,
		reverse = false,
		speed = 40,
		gap = 24,
		fade = true,
		pauseOnHover = true,
		paused = $bindable(false),
		controls = true,
		pauseLabel = 'Pause scrolling',
		resumeLabel = 'Resume scrolling',
		class: className,
		...rest
	}: MarqueeProps = $props();
	const policy = useMotionPolicy();
	const measure: Attachment<HTMLDivElement> = (node) => {
		const first = node.querySelector<HTMLElement>('[data-marquee-set]');
		if (!first) return;
		const isVertical = vertical;
		const pixelsPerSecond = Math.max(1, speed);
		const update = () => {
			const distance = isVertical ? first.offsetHeight : first.offsetWidth;
			node.style.setProperty('--travel', `${distance}px`);
			node.style.setProperty('--duration', `${distance / pixelsPerSecond}s`);
		};
		const observer = new ResizeObserver(update);
		observer.observe(first);
		update();
		return () => observer.disconnect();
	};
</script>

<div
	{...rest}
	data-slot="marquee"
	{@attach pauseDecorative}
	data-vertical={vertical}
	data-reduced={policy.reduced}
	data-paused={paused}
	data-hover-pause={pauseOnHover}
	class={cn('marquee', className)}
	style:--gap={`${Math.max(0, gap)}px`}
>
	<div class="viewport" data-fade={fade}>
		<div class="track" {@attach measure} style:animation-direction={reverse ? 'reverse' : 'normal'}>
			<div data-marquee-set class="set">{@render children?.()}</div>
			<div aria-hidden="true" inert class="set duplicate">{@render children?.()}</div>
		</div>
	</div>
	{#if controls && !policy.reduced}<button
			type="button"
			class="mt-3 rounded-md border px-3 py-1 text-xs focus-visible:outline-2 focus-visible:outline-ring"
			aria-pressed={paused}
			onclick={() => (paused = !paused)}>{paused ? resumeLabel : pauseLabel}</button
		>{/if}
</div>

<style>
	.marquee {
		min-width: 0;
		--travel: 100%;
		--duration: 30s;
	}
	.viewport {
		overflow: hidden;
	}
	.viewport[data-fade='true'] {
		mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
	}
	.track {
		display: flex;
		width: 100%;
		animation: marquee-scroll var(--duration) linear infinite;
		animation-play-state: var(--bedrock-decorative-play-state, paused);
	}
	.set {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-shrink: 0;
		min-width: 100%;
		gap: var(--gap);
		padding-inline: calc(var(--gap) / 2);
		box-sizing: border-box;
	}
	[data-vertical='true'] .viewport {
		height: var(--marquee-height, 16rem);
	}
	[data-vertical='true'] .viewport[data-fade='true'] {
		mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
	}
	[data-vertical='true'] .track {
		height: 100%;
		flex-direction: column;
		animation-name: marquee-scroll-vertical;
	}
	[data-vertical='true'] .set {
		flex-direction: column;
		min-height: 100%;
		padding-inline: 0;
		padding-block: calc(var(--gap) / 2);
	}
	[data-paused='true'] .track,
	[data-hover-pause='true']:hover .track,
	.marquee:focus-within .track {
		animation-play-state: paused;
	}
	.marquee:focus-within .track {
		transform: none !important;
	}
	.marquee:focus-within .viewport {
		mask-image: none;
		overflow: auto;
	}
	.marquee:focus-within .duplicate {
		display: none;
	}
	[data-reduced='true'] .track {
		animation: none;
	}
	[data-reduced='true'] .duplicate {
		display: none;
	}
	[data-reduced='true'] .set {
		flex-wrap: wrap;
	}
	[data-reduced='true'] .viewport {
		height: auto;
		mask-image: none;
		overflow: visible;
	}
	@keyframes marquee-scroll {
		to {
			transform: translateX(calc(-1 * var(--travel)));
		}
	}
	@keyframes marquee-scroll-vertical {
		to {
			transform: translateY(calc(-1 * var(--travel)));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}
		.duplicate {
			display: none;
		}
		.set {
			flex-wrap: wrap;
		}
		.viewport {
			height: auto !important;
			mask-image: none !important;
			overflow: visible;
		}
	}
</style>
