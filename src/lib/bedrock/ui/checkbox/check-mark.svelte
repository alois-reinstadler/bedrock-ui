<script lang="ts">
	import { untrack } from 'svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import type { ClassValue } from 'svelte/elements';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn } from '#lib/utils.js';

	let { class: className, animate = false }: { class?: ClassValue; animate?: boolean } = $props();
	const animateEntrance = untrack(() => animate);
	const policy = useMotionPolicy();
</script>

<span
	class={cn('checkbox-mark inline-flex size-3.5 shrink-0', className)}
	data-slot="checkbox-check"
	data-animate={animateEntrance || undefined}
	data-reduced={policy.reduced || undefined}
	aria-hidden="true"
>
	<CheckIcon class="size-full" />
</span>

<style>
	.checkbox-mark :global(path) {
		/* Longer than the Lucide check's full 24-unit-viewBox stroke. */
		stroke-dasharray: 24;
		stroke-dashoffset: 0;
	}

	.checkbox-mark[data-animate] :global(path) {
		animation: check-draw var(--motion-enter, 230ms) var(--motion-ease-enter, ease-out) both;
	}

	.checkbox-mark[data-reduced] :global(path) {
		animation: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.checkbox-mark :global(path) {
			animation: none;
		}
	}

	@keyframes check-draw {
		from {
			stroke-dashoffset: -24;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
