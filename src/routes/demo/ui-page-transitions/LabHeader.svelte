<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
</script>

<header class="lab-header">
	<div class="header-nav">
		<a href={resolve('/demo/ui')}><ArrowLeftIcon class="size-4" /> Motion Lab</a>
		<span>Studie / 02</span>
	</div>
	<div class="header-copy">
		<div>
			<p class="kicker">Bedrock / Seitenwechsel</p>
			<h1>Motion mit<br />einer Aufgabe.</h1>
		</div>
		<p>
			Ein guter Übergang erklärt, was gerade passiert ist. Vier Szenarien zeigen Kontinuität,
			Richtung, räumlichen Kontext und Abschluss – jeweils direkt ausprobierbar.
		</p>
	</div>
</header>

<style>
	.lab-header {
		width: min(100%, 92rem);
		margin-inline: auto;
	}
	.header-nav,
	.kicker {
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.header-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid rgb(30 30 27 / 18%);
		color: #6f6d66;
	}
	.header-nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		transition: color 180ms ease;
	}
	.header-nav a:hover {
		color: #1e1e1b;
	}
	.header-copy {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.45fr);
		gap: 3rem;
		align-items: end;
		padding: clamp(2rem, 5vw, 4.5rem) 0;
	}
	.kicker {
		margin-bottom: 1rem;
		color: #77746d;
	}
	.header-copy h1 {
		max-width: 11ch;
		font-size: clamp(3.4rem, 8vw, 8rem);
		font-weight: 510;
		line-height: 0.79;
		letter-spacing: -0.08em;
	}
	.header-copy > p {
		max-width: 43ch;
		padding-bottom: 0.4rem;
		font-size: clamp(0.82rem, 1.2vw, 0.95rem);
		line-height: 1.65;
		color: #6b6962;
	}

	@media (max-width: 900px) {
		.header-copy {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
	@media (max-width: 640px) {
		.header-copy {
			padding: 2.5rem 0;
		}
		.header-copy h1 {
			font-size: 3.8rem;
		}
	}
</style>
