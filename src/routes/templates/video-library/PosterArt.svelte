<script lang="ts">
	import type { PosterTone } from './catalog.js';

	let {
		tone,
		mark,
		wide = false,
		class: className = ''
	}: { tone: PosterTone; mark: string; wide?: boolean; class?: string } = $props();
</script>

<div
	class={['poster-art', wide && 'poster-art--wide', className]}
	data-tone={tone}
	aria-hidden="true"
>
	<div class="poster-art__orb poster-art__orb--one"></div>
	<div class="poster-art__orb poster-art__orb--two"></div>
	<div class="poster-art__horizon"></div>
	<span>{mark}</span>
</div>

<style>
	.poster-art {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 16 / 10;
		background: var(--art-base);
		color: var(--art-ink);
	}

	.poster-art--wide {
		aspect-ratio: auto;
		height: 100%;
		min-height: 24rem;
	}

	.poster-art::before {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(
				115deg,
				transparent 35%,
				color-mix(in oklab, var(--art-flare), transparent 32%)
			),
			repeating-linear-gradient(
				-12deg,
				transparent 0 22px,
				color-mix(in oklab, var(--art-ink), transparent 93%) 23px 24px
			);
		content: '';
	}

	.poster-art__orb {
		position: absolute;
		border-radius: 999px;
		background: var(--art-flare);
		filter: blur(1px);
	}

	.poster-art__orb--one {
		top: -22%;
		right: -4%;
		width: 45%;
		aspect-ratio: 1;
		opacity: 0.82;
	}

	.poster-art__orb--two {
		bottom: 12%;
		left: 12%;
		width: 16%;
		aspect-ratio: 1;
		border: 1px solid color-mix(in oklab, var(--art-ink), transparent 60%);
		background: transparent;
	}

	.poster-art__horizon {
		position: absolute;
		inset: auto 0 0;
		height: 36%;
		background: linear-gradient(
			to top,
			color-mix(in oklab, var(--art-ink), transparent 82%),
			transparent
		);
		clip-path: polygon(
			0 55%,
			16% 36%,
			30% 54%,
			48% 8%,
			65% 53%,
			80% 30%,
			100% 60%,
			100% 100%,
			0 100%
		);
	}

	.poster-art span {
		position: absolute;
		right: 0.9rem;
		bottom: 0.7rem;
		font-size: clamp(1rem, 3vw, 1.7rem);
		font-weight: 750;
		letter-spacing: -0.06em;
	}

	.poster-art[data-tone='ember'] {
		--art-base: oklch(0.3 0.14 30);
		--art-flare: oklch(0.73 0.17 55);
		--art-ink: oklch(0.96 0.03 70);
	}

	.poster-art[data-tone='tide'] {
		--art-base: oklch(0.25 0.09 235);
		--art-flare: oklch(0.72 0.11 195);
		--art-ink: oklch(0.96 0.02 210);
	}

	.poster-art[data-tone='violet'] {
		--art-base: oklch(0.28 0.12 300);
		--art-flare: oklch(0.7 0.16 335);
		--art-ink: oklch(0.96 0.03 310);
	}

	.poster-art[data-tone='moss'] {
		--art-base: oklch(0.28 0.08 145);
		--art-flare: oklch(0.7 0.12 120);
		--art-ink: oklch(0.96 0.03 120);
	}

	.poster-art[data-tone='solar'] {
		--art-base: oklch(0.35 0.1 75);
		--art-flare: oklch(0.82 0.16 88);
		--art-ink: oklch(0.97 0.025 90);
	}

	.poster-art[data-tone='slate'] {
		--art-base: oklch(0.25 0.03 255);
		--art-flare: oklch(0.68 0.05 245);
		--art-ink: oklch(0.96 0.01 250);
	}

	@media (prefers-reduced-motion: no-preference) {
		.poster-art__orb--one {
			transition: transform var(--motion-layout) var(--motion-ease-move);
		}

		:global(a:hover) .poster-art__orb--one,
		:global(button:hover) .poster-art__orb--one {
			transform: translate3d(-4%, 5%, 0) scale(1.06);
		}
	}
</style>
