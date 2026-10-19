<script module lang="ts">
	export interface ChatWaveformProps {
		/** Raw microphone RMS from 0 to 1. Ignored when analyser is supplied. */
		level?: number;
		/** App-owned Web Audio analyser. No microphone permission is requested by this component. */
		analyser?: AnalyserNode;
		/** False renders a still baseline and stops sampling. */
		active?: boolean;
		/** Visual sensitivity, clamped to 0.1–8. Does not alter recorded audio. */
		sensitivity?: number;
		/** Ignore near-silence below this raw RMS threshold (0–0.2). */
		noiseFloor?: number;
		/** Accessible label for the raw microphone level meter. */
		label?: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { createWaveformRenderer } from './waveform.js';
	let {
		level = 0,
		analyser,
		active = true,
		sensitivity = 2.2,
		noiseFloor = 0.003,
		label = 'Microphone level',
		class: className
	}: ChatWaveformProps = $props();
	const policy = useMotionPolicy();
	function render(node: HTMLDivElement) {
		const renderer = createWaveformRenderer(node);
		function updateRenderer() {
			renderer.update({
				active,
				level,
				analyser,
				sensitivity,
				noiseFloor,
				reduced: policy.reduced
			});
		}
		$effect(updateRenderer);
		return () => renderer.dispose();
	}
</script>

<div
	{@attach render}
	data-slot="chat-waveform"
	data-active={active}
	class={cn('relative h-24 w-full min-w-0 overflow-hidden text-foreground', className)}
>
	<svg
		aria-hidden="true"
		viewBox="0 0 640 96"
		preserveAspectRatio="none"
		class="block size-full"
		fill="none"
	>
		<path
			d="M 0 48 H 640"
			stroke="currentColor"
			stroke-opacity="0.08"
			vector-effect="non-scaling-stroke"
		/>
		{#each [0.8, 0.3, 0.12] as opacity, index (index)}
			<path
				data-wave={index}
				d="M 0 48 H 640"
				stroke="currentColor"
				stroke-opacity={opacity}
				stroke-width={index === 0 ? 2 : 1.5}
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
		{/each}
	</svg>
	<meter min="0" max="1" value="0" aria-label={label} class="sr-only"></meter>
</div>
