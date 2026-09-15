<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TransitionConfig } from 'svelte/transition';
	import { cn } from '#lib/utils.js';
	import { resolveMotionDuration } from './policy.js';
	import { motionEasings, motionPresets } from './tokens.js';

	let {
		key,
		effect = 'fade',
		direction = 'forward',
		duration = motionPresets.swap.duration,
		class: className,
		children
	}: {
		/** Content transitions whenever this value changes. */
		key: unknown;
		/** `fade` works for general compact content; `slide-up` rolls a single line vertically. */
		effect?: 'fade' | 'slide-up';
		/** Direction of a slide transition. Backward reverses both entering and leaving travel. */
		direction?: 'forward' | 'backward';
		duration?: number;
		class?: string;
		children: Snippet;
	} = $props();

	function clampProgress(t: number): number {
		return Math.min(Math.max(t, 0), 1);
	}

	function contentProgress(t: number, direction: 'in' | 'out'): number {
		const elapsed = direction === 'in' ? clampProgress(t) : 1 - clampProgress(t);
		return motionEasings.move(elapsed);
	}

	function slideDistance(node: HTMLElement): number {
		return Math.max(8, Math.round(node.getBoundingClientRect().height * 0.65));
	}

	function copyIn(
		node: HTMLElement,
		params: {
			duration: number;
			effect: 'fade' | 'slide-up';
			direction: 'forward' | 'backward';
		}
	): TransitionConfig {
		const opacity = Number.parseFloat(getComputedStyle(node).opacity);
		const resolvedDuration = resolveMotionDuration(params.duration);
		if (params.effect === 'slide-up') {
			const travel = slideDistance(node);
			const sign = params.direction === 'forward' ? 1 : -1;
			return {
				duration: resolvedDuration,
				css: (t) => {
					const progress = contentProgress(t, 'in');
					return (
						`position: relative;` +
						`top: ${Math.round(sign * travel * (1 - progress))}px;` +
						`opacity: ${progress * opacity};`
					);
				}
			};
		}
		return {
			duration: resolvedDuration,
			css: (t) => `opacity: ${contentProgress(t, 'in') * opacity};`
		};
	}

	function copyOut(
		node: HTMLElement,
		params: {
			duration: number;
			effect: 'fade' | 'slide-up';
			direction: 'forward' | 'backward';
		}
	): TransitionConfig {
		const style = getComputedStyle(node);
		const opacity = Number.parseFloat(style.opacity);
		const rect = node.getBoundingClientRect();
		const parentRect = node.offsetParent?.getBoundingClientRect();
		const left = parentRect ? rect.left - parentRect.left : node.offsetLeft;
		const top = parentRect ? rect.top - parentRect.top : node.offsetTop;
		const width = node.offsetWidth;
		const height = node.offsetHeight;
		const resolvedDuration = resolveMotionDuration(params.duration);
		const travel = slideDistance(node);
		const sign = params.direction === 'forward' ? -1 : 1;
		return {
			duration: resolvedDuration,
			css: (t) => {
				const progress = contentProgress(t, 'out');
				const animatedTop =
					params.effect === 'slide-up' ? top + Math.round(sign * travel * progress) : top;
				return (
					`position: absolute;` +
					`left: ${left}px;` +
					`top: ${animatedTop.toFixed(3)}px;` +
					`width: ${width}px;` +
					`height: ${height}px;` +
					`box-sizing: border-box;` +
					`margin: 0;` +
					`opacity: ${(1 - progress) * opacity};` +
					`pointer-events: none;`
				);
			}
		};
	}
</script>

<!-- The shell sizes to the entering copy immediately. Fade uses complementary
     opacity; slide-up keeps both copies crisp and clips the vertical roll. -->
<span
	data-slot="swap"
	data-direction={direction}
	class={cn('relative grid items-center justify-items-start', className)}
	style:overflow={effect === 'slide-up' ? 'hidden' : undefined}
>
	{#key key}
		<span
			class="inline-flex items-center justify-center gap-2 [grid-area:1/1]"
			in:copyIn={{
				effect,
				direction,
				duration
			}}
			out:copyOut={{
				effect,
				direction,
				duration
			}}
		>
			{@render children()}
		</span>
	{/key}
</span>
