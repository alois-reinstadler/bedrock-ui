<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	export type AnimatedSignatureProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		text: string;
		paths?: string[];
		viewBox?: string;
		fontUrl?: string;
		fontSize?: number;
		duration?: number;
		delay?: number;
		strokeWidth?: number;
		color?: string;
		filled?: boolean;
		onLoadError?: (error: Error) => void;
	};
	let {
		text,
		paths = [],
		viewBox = '0 0 320 100',
		fontUrl,
		fontSize = 72,
		duration = 2,
		delay = 0,
		strokeWidth = 1.5,
		color = 'currentColor',
		filled = false,
		onLoadError,
		class: className,
		...rest
	}: AnimatedSignatureProps = $props();
	const policy = useMotionPolicy();
	// Completing a one-shot under reduction must not replay it when preference changes back.
	function settleDrawing(node: HTMLElement) {
		if (policy.reduced) node.dataset.motionSettled = 'true';
	}
	let generated = $state<{ key: string; path: string; viewBox: string } | null>(null);
	const fontKey = $derived(JSON.stringify([fontUrl, text, fontSize]));
	const currentFont = $derived(generated?.key === fontKey ? generated : null);
	const drawing = $derived(paths.length ? paths : currentFont ? [currentFont.path] : []);
	const bounds = $derived(paths.length ? viewBox : (currentFont?.viewBox ?? viewBox));
	const solid = $derived(filled || (!paths.length && !!currentFont));
	const loadFont: Attachment<HTMLDivElement> = () => {
		const url = fontUrl;
		const content = text;
		const size = fontSize;
		const key = fontKey;
		if (!url || paths.length || !content) return;
		const controller = new AbortController();
		async function load() {
			try {
				const [response, opentype] = await Promise.all([
					fetch(url!, { signal: controller.signal }),
					import('opentype.js')
				]);
				if (!response.ok) throw new Error(`Signature font request failed (${response.status}).`);
				const font = opentype.parse(await response.arrayBuffer());
				const path = font.getPath(content, 0, 0, size);
				const box = path.getBoundingBox();
				const padding = Math.max(4, size * 0.06);
				if (controller.signal.aborted) return;
				generated = {
					key,
					path: path.toPathData(3),
					viewBox: `${box.x1 - padding} ${box.y1 - padding} ${Math.max(1, box.x2 - box.x1) + padding * 2} ${Math.max(1, box.y2 - box.y1) + padding * 2}`
				};
			} catch (error) {
				if (!controller.signal.aborted)
					onLoadError?.(
						error instanceof Error ? error : new Error('Unable to load signature font.')
					);
			}
		}
		void load();
		return () => controller.abort();
	};
</script>

<div
	{...rest}
	data-slot="animated-signature"
	{@attach settleDrawing}
	data-reduced={policy.reduced}
	class={cn('signature', className)}
	style:--signature-color={color}
	style:--draw-duration={`${Math.max(0, duration)}s`}
	style:--draw-delay={`${Math.max(0, delay)}s`}
	{@attach loadFont}
>
	{#if drawing.length}
		<svg
			role="img"
			aria-label={text}
			viewBox={bounds}
			class="h-auto w-full"
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>{text}</title>
			{#each drawing as path, i (`${i}:${path}`)}<path
					d={path}
					pathLength="1"
					class:solid
					style:animation-delay={`${Math.max(0, delay) + (i * Math.max(0, duration)) / drawing.length}s`}
					style:animation-duration={`${Math.max(0, duration) / drawing.length}s`}
				/>{/each}
		</svg>
	{:else}<span class="font-serif text-4xl italic">{text}</span>{/if}
</div>

<style>
	.signature {
		color: var(--signature-color);
	}
	path {
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		animation: draw var(--draw-duration) ease-in-out both;
	}
	path.solid {
		fill: var(--signature-color);
		animation-name: draw-filled;
	}
	@keyframes draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes draw-filled {
		0% {
			stroke-dashoffset: 1;
			fill-opacity: 0;
		}
		75% {
			fill-opacity: 0;
		}
		100% {
			stroke-dashoffset: 0;
			fill-opacity: 1;
		}
	}
	[data-motion-settled='true'] path,
	[data-reduced='true'] path {
		animation: none;
	}
	@media (prefers-reduced-motion: reduce) {
		path {
			animation: none;
		}
	}
</style>
