<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import type { RunTransition } from './types';

	type Issue = {
		id: string;
		number: string;
		title: string;
		subtitle: string;
		place: string;
		palette: string;
	};

	let { runTransition }: { runTransition: RunTransition } = $props();

	const issues: Issue[] = [
		{
			id: 'fjord',
			number: 'No. 18',
			title: 'An der Kante',
			subtitle: 'Architektur, die dem Wetter nicht ausweicht.',
			place: 'Vesterålen, NO',
			palette: 'fjord'
		},
		{
			id: 'dune',
			number: 'No. 19',
			title: 'Leiser Boden',
			subtitle: 'Ein Haus, zwei Höfe und sehr viel Himmel.',
			place: 'Alentejo, PT',
			palette: 'dune'
		},
		{
			id: 'forest',
			number: 'No. 20',
			title: 'Unter Kiefern',
			subtitle: 'Wie wenig ein Rückzugsort wirklich braucht.',
			place: 'Weinviertel, AT',
			palette: 'forest'
		}
	];

	let selected = $state<Issue | null>(null);
	let sharedIssue = $state<string | null>(null);

	function openIssue(issue: Issue) {
		runTransition(
			'shared-forward',
			() => (selected = issue),
			() => (sharedIssue = issue.id)
		);
	}

	function closeIssue() {
		runTransition('shared-back', () => (selected = null));
	}
</script>

<section class="transition-stage magazine" aria-label="Magazin-Beispiel">
	{#if selected}
		<div class="article-page">
			<nav class="article-nav" aria-label="Artikelnavigation">
				<button type="button" class="back-button" onclick={closeIssue}>
					<ArrowLeftIcon class="size-4" />
					Archiv
				</button>
				<span>Terrain / {selected.number}</span>
			</nav>

			<div class="article-grid">
				<div
					class={['cover cover-large', selected.palette]}
					style:view-transition-name="shared-cover"
				>
					<span class="cover-index">{selected.number}</span>
					<div class="cover-mark" aria-hidden="true"></div>
					<span class="cover-place">{selected.place}</span>
				</div>
				<div class="article-copy">
					<p class="eyebrow">Reportage</p>
					<h3 style:view-transition-name="shared-title">{selected.title}</h3>
					<p class="standfirst">{selected.subtitle}</p>
					<div class="article-meta">
						<span>Text: Mira Kern</span>
						<span>8 Minuten</span>
					</div>
					<p class="article-body">
						Der erste Raum beginnt draußen. Wind zieht durch die Gräser, das Licht bleibt an den
						rauen Flächen hängen. Erst dann öffnet sich das Haus – langsam, präzise und ohne große
						Geste.
					</p>
					<button type="button" class="read-button">
						Reportage lesen <ArrowUpRightIcon class="size-4" />
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="archive-page">
			<header class="archive-header">
				<div>
					<p class="eyebrow">Terrain / Archiv</p>
					<h3>Orte mit Haltung.</h3>
				</div>
				<p>Drei Reisen über Räume, Material und die Kunst, nicht alles zu erklären.</p>
			</header>

			<div class="cover-grid">
				{#each issues as issue, index (issue.id)}
					<button class="issue-card" type="button" onclick={() => openIssue(issue)}>
						<span
							class={['cover', issue.palette]}
							style:view-transition-name={sharedIssue === issue.id ? 'shared-cover' : 'none'}
						>
							<span class="cover-index">{issue.number}</span>
							<span class="cover-mark" aria-hidden="true"></span>
							<span class="cover-place">{issue.place}</span>
						</span>
						<span class="issue-line">
							<span>
								<small>0{index + 1}</small>
								<strong
									style:view-transition-name={sharedIssue === issue.id ? 'shared-title' : 'none'}
									>{issue.title}</strong
								>
							</span>
							<ArrowUpRightIcon class="size-4" />
						</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	.magazine {
		min-height: 34rem;
		background: #ece9e0;
		color: #1b1b18;
	}

	.archive-page,
	.article-page {
		min-height: 34rem;
		padding: clamp(1.25rem, 3vw, 2.25rem);
	}

	.archive-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.eyebrow,
	.archive-header > p,
	.article-nav,
	.cover-index,
	.cover-place,
	.article-meta {
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.archive-header h3 {
		margin-top: 0.45rem;
		max-width: 10ch;
		font-size: clamp(2.2rem, 5vw, 4.5rem);
		font-weight: 500;
		line-height: 0.88;
		letter-spacing: -0.06em;
	}

	.archive-header > p {
		max-width: 28ch;
		font-weight: 500;
		line-height: 1.7;
		letter-spacing: 0.04em;
		text-transform: none;
		color: #656158;
	}

	.cover-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(0.75rem, 2vw, 1.5rem);
	}

	.issue-card {
		min-width: 0;
		text-align: left;
	}

	.cover {
		position: relative;
		display: block;
		aspect-ratio: 0.78;
		overflow: hidden;
		border-radius: 0.18rem;
		box-shadow: 0 1.2rem 2rem -1.5rem rgb(31 29 24 / 45%);
		transition: transform 350ms cubic-bezier(0.2, 0.75, 0.2, 1);
	}

	.issue-card:hover .cover {
		transform: translateY(-0.35rem) rotate(-0.4deg);
	}

	.fjord {
		background:
			linear-gradient(155deg, transparent 46%, rgb(28 43 43 / 65%) 46.2%, transparent 47%),
			linear-gradient(35deg, #9ca8a2 0 32%, #314a4c 32% 54%, #b4c6c3 54% 66%, #607a7c 66%);
	}

	.dune {
		background:
			radial-gradient(circle at 68% 38%, #d47b52 0 10%, transparent 10.5%),
			linear-gradient(164deg, transparent 46%, #9a6048 46.3% 48%, transparent 48.3%),
			linear-gradient(25deg, #e4bd8c 0 43%, #bd8e64 43% 62%, #6b7d82 62%);
	}

	.forest {
		background:
			linear-gradient(90deg, transparent 0 17%, rgb(28 45 36 / 78%) 17.5% 20%, transparent 20.5%),
			linear-gradient(79deg, transparent 0 65%, rgb(33 53 42 / 70%) 65.5% 69%, transparent 69.5%),
			linear-gradient(145deg, #9eaf86 0 42%, #42624b 42% 68%, #172e29 68%);
	}

	.cover::after {
		position: absolute;
		inset: 0;
		background: linear-gradient(115deg, rgb(255 255 255 / 18%), transparent 42%, rgb(0 0 0 / 10%));
		content: '';
	}

	.cover-index,
	.cover-place {
		position: absolute;
		z-index: 1;
		color: white;
	}

	.cover-index {
		top: 0.9rem;
		left: 0.9rem;
	}

	.cover-place {
		right: 0.9rem;
		bottom: 0.9rem;
		writing-mode: vertical-rl;
	}

	.cover-mark {
		position: absolute;
		top: 48%;
		left: 50%;
		z-index: 1;
		width: 42%;
		aspect-ratio: 1;
		border: 1px solid rgb(255 255 255 / 75%);
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.cover-mark::before,
	.cover-mark::after {
		position: absolute;
		background: rgb(255 255 255 / 75%);
		content: '';
	}

	.cover-mark::before {
		top: 50%;
		left: -28%;
		width: 156%;
		height: 1px;
	}

	.cover-mark::after {
		top: -28%;
		left: 50%;
		width: 1px;
		height: 156%;
	}

	.issue-line {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 0.75rem;
		padding-top: 0.75rem;
	}

	.issue-line small {
		display: block;
		margin-bottom: 0.15rem;
		font-size: 0.6rem;
		color: #817d73;
	}

	.issue-line strong {
		display: block;
		font-size: clamp(0.9rem, 2vw, 1.15rem);
		font-weight: 550;
		letter-spacing: -0.025em;
	}

	.article-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.3rem;
		color: #656158;
	}

	.back-button,
	.read-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.back-button:hover {
		color: #141411;
	}

	.article-grid {
		display: grid;
		grid-template-columns: minmax(12rem, 0.82fr) minmax(0, 1.18fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: center;
	}

	.cover-large {
		width: min(100%, 20rem);
		justify-self: center;
	}

	.article-copy h3 {
		margin-top: 0.7rem;
		font-size: clamp(2.6rem, 6vw, 5.4rem);
		font-weight: 500;
		line-height: 0.86;
		letter-spacing: -0.07em;
	}

	.standfirst {
		max-width: 31ch;
		margin-top: 1.2rem;
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.35;
		color: #4d4a43;
	}

	.article-meta {
		display: flex;
		gap: 1.5rem;
		margin-top: 1.5rem;
		padding-top: 0.8rem;
		border-top: 1px solid #cac5b9;
		color: #777269;
	}

	.article-body {
		max-width: 50ch;
		margin-top: 1.25rem;
		font-family: Georgia, serif;
		font-size: 0.92rem;
		line-height: 1.65;
		color: #4d4a43;
	}

	.read-button {
		margin-top: 1.25rem;
		padding: 0.72rem 1rem;
		border: 1px solid #aaa397;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.magazine,
		.archive-page,
		.article-page {
			min-height: 39rem;
		}

		.archive-header {
			align-items: start;
			flex-direction: column;
			gap: 1rem;
		}

		.cover-grid {
			grid-template-columns: repeat(3, minmax(8.4rem, 1fr));
			overflow-x: auto;
			padding-bottom: 0.75rem;
		}

		.article-grid {
			grid-template-columns: 8.5rem minmax(0, 1fr);
			align-items: start;
			gap: 1rem;
		}

		.article-copy h3 {
			font-size: 2.65rem;
		}

		.article-body {
			grid-column: 1 / -1;
		}
	}
</style>
