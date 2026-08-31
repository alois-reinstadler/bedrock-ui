<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import BellIcon from '@lucide/svelte/icons/bell';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import type { RunTransition } from './types';

	type Brief = {
		id: string;
		code: string;
		name: string;
		owner: string;
		status: string;
		due: string;
		progress: number;
	};

	let { runTransition }: { runTransition: RunTransition } = $props();

	const briefs: Brief[] = [
		{
			id: 'neue-donau',
			code: 'ND-24',
			name: 'Neue Donau',
			owner: 'Lea',
			status: 'Review',
			due: '03. Sep',
			progress: 82
		},
		{
			id: 'waldhaus',
			code: 'WH-09',
			name: 'Waldhaus',
			owner: 'Eren',
			status: 'Aktiv',
			due: '08. Sep',
			progress: 56
		},
		{
			id: 'forum',
			code: 'FR-18',
			name: 'Forum Nord',
			owner: 'Mina',
			status: 'Entwurf',
			due: '12. Sep',
			progress: 34
		},
		{
			id: 'atelier',
			code: 'AT-31',
			name: 'Atelier 31',
			owner: 'Noah',
			status: 'Aktiv',
			due: '18. Sep',
			progress: 68
		}
	];

	let selected = $state<Brief | null>(null);
	let sharedRow = $state<string | null>(null);

	function openBrief(brief: Brief) {
		runTransition(
			'depth-forward',
			() => (selected = brief),
			() => (sharedRow = brief.id)
		);
	}

	function closeBrief() {
		runTransition('depth-back', () => (selected = null));
	}
</script>

<section class="transition-stage workspace" aria-label="Arbeitsbereich-Beispiel">
	<aside class="workspace-rail" style:view-transition-name="workspace-rail">
		<div class="brand">B</div>
		<nav aria-label="Bereiche">
			<button class="active" type="button" aria-label="Posteingang"
				><InboxIcon class="size-4" /></button
			>
			<button type="button" aria-label="Dokumente"><FileTextIcon class="size-4" /></button>
			<button type="button" aria-label="Benachrichtigungen"><BellIcon class="size-4" /></button>
		</nav>
		<button type="button" aria-label="Einstellungen"><SettingsIcon class="size-4" /></button>
	</aside>

	<div class="workspace-main" style:view-transition-name="workspace-content">
		{#if selected}
			<div class="brief-detail">
				<header class="workspace-header">
					<button type="button" class="workspace-back" onclick={closeBrief}>
						<ArrowLeftIcon class="size-4" /> Alle Projekte
					</button>
					<div class="avatar">LK</div>
				</header>

				<div class="brief-heading" style:view-transition-name="shared-row">
					<div>
						<p>{selected.code} / {selected.status}</p>
						<h3>{selected.name}</h3>
					</div>
					<button type="button">Freigeben <ArrowUpRightIcon class="size-4" /></button>
				</div>

				<div class="brief-layout">
					<div class="plan-card" aria-label="Abstrakter Projektplan">
						<span class="plan-block block-a"></span>
						<span class="plan-block block-b"></span>
						<span class="plan-block block-c"></span>
						<span class="plan-line line-a"></span>
						<span class="plan-line line-b"></span>
						<span class="north">N</span>
					</div>
					<div class="brief-notes">
						<p class="label">Nächster Meilenstein</p>
						<h4>Materialrunde mit Bauherrschaft</h4>
						<p>Fassade, Geländer und die drei Muster für den Eingangsbereich final abstimmen.</p>
						<div class="progress-row">
							<span>Projektfortschritt</span><strong>{selected.progress}%</strong>
						</div>
						<div class="progress-track"><span style:width={`${selected.progress}%`}></span></div>
						<div class="people"><i>LK</i><i>EM</i><i>NS</i><span>+4 im Projekt</span></div>
					</div>
				</div>
			</div>
		{:else}
			<div class="brief-list">
				<header class="workspace-header">
					<div>
						<p class="workspace-kicker">Arbeitsbereich / Projekte</p>
						<h3>Guten Morgen, Lea.</h3>
					</div>
					<div class="header-actions">
						<button type="button" aria-label="Suchen"><SearchIcon class="size-4" /></button>
						<div class="avatar">LK</div>
					</div>
				</header>

				<div class="summary-grid">
					<div><span>12</span><small>Aktiv</small></div>
					<div><span>04</span><small>Im Review</small></div>
					<div><span>89%</span><small>Im Plan</small></div>
				</div>

				<div class="list-labels"><span>Projekt</span><span>Status</span><span>Fällig</span></div>
				<div class="project-list">
					{#each briefs as brief (brief.id)}
						<button
							type="button"
							class="project-row"
							style:view-transition-name={sharedRow === brief.id ? 'shared-row' : 'none'}
							onclick={() => openBrief(brief)}
						>
							<span class="project-name"
								><i>{brief.code}</i><strong>{brief.name}</strong><small>mit {brief.owner}</small
								></span
							>
							<span class="status"><i></i>{brief.status}</span>
							<span class="due">{brief.due}<ArrowUpRightIcon class="size-4" /></span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.workspace {
		display: grid;
		grid-template-columns: 4.25rem minmax(0, 1fr);
		min-height: 34rem;
		background: #f4f5f3;
		color: #1d211d;
	}

	.workspace-rail {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 1rem 0;
		border-right: 1px solid #dfe1dc;
		background: #e9ebe7;
	}

	.brand,
	.avatar {
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-size: 0.68rem;
		font-weight: 700;
	}

	.brand {
		width: 2rem;
		aspect-ratio: 1;
		background: #1d211d;
		color: white;
	}

	.workspace-rail nav {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.35rem;
		margin-top: 2rem;
	}

	.workspace-rail button,
	.header-actions button {
		display: grid;
		width: 2.35rem;
		aspect-ratio: 1;
		place-items: center;
		border-radius: 0.7rem;
		color: #7c8179;
	}

	.workspace-rail button.active {
		background: white;
		color: #1d211d;
		box-shadow: 0 0.4rem 1rem rgb(40 45 39 / 8%);
	}

	.workspace-main {
		min-width: 0;
		padding: clamp(1.15rem, 3vw, 2.25rem);
	}

	.workspace-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.workspace-kicker,
	.brief-heading p,
	.label,
	.list-labels,
	.project-name i,
	.project-name small,
	.status,
	.due {
		font-size: 0.62rem;
		font-weight: 600;
		font-style: normal;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: #858a82;
	}

	.workspace-header h3 {
		margin-top: 0.35rem;
		font-size: clamp(1.8rem, 4vw, 3rem);
		font-weight: 520;
		line-height: 1;
		letter-spacing: -0.055em;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar {
		width: 2.35rem;
		aspect-ratio: 1;
		background: #cde99d;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.65rem;
		margin-top: 2rem;
	}

	.summary-grid div {
		display: flex;
		align-items: end;
		justify-content: space-between;
		min-height: 5rem;
		padding: 0.9rem;
		border: 1px solid #e0e2dd;
		border-radius: 0.9rem;
		background: rgb(255 255 255 / 58%);
	}

	.summary-grid span {
		font-size: 1.6rem;
		font-weight: 550;
		letter-spacing: -0.05em;
	}

	.summary-grid small {
		font-size: 0.63rem;
		color: #7c8179;
	}

	.list-labels,
	.project-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 7rem 6.5rem;
		align-items: center;
		gap: 1rem;
	}

	.list-labels {
		margin-top: 1.7rem;
		padding: 0 0.85rem 0.55rem;
	}

	.project-list {
		overflow: hidden;
		border: 1px solid #e0e2dd;
		border-radius: 1rem;
		background: white;
	}

	.project-row {
		width: 100%;
		padding: 0.8rem 0.85rem;
		text-align: left;
		transition: background 180ms ease;
	}

	.project-row + .project-row {
		border-top: 1px solid #e9ebe7;
	}

	.project-row:hover {
		background: #f7f8f5;
	}

	.project-name {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr) 5rem;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.project-name strong {
		overflow: hidden;
		font-size: 0.82rem;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: #596057;
	}

	.status i {
		width: 0.38rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #96bf56;
	}

	.due {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #596057;
	}

	.workspace-back {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.72rem;
		font-weight: 600;
		color: #656b63;
	}

	.brief-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
	}

	.brief-heading h3 {
		margin-top: 0.35rem;
		font-size: clamp(2.2rem, 5vw, 4.5rem);
		font-weight: 520;
		line-height: 0.9;
		letter-spacing: -0.065em;
	}

	.brief-heading button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.65rem 0.9rem;
		border-radius: 999px;
		background: #1d211d;
		font-size: 0.7rem;
		font-weight: 600;
		color: white;
	}

	.brief-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(13rem, 0.8fr);
		gap: 0.75rem;
		margin-top: 1.6rem;
	}

	.plan-card,
	.brief-notes {
		min-height: 17rem;
		border: 1px solid #dfe1dc;
		border-radius: 1rem;
		background: white;
	}

	.plan-card {
		position: relative;
		overflow: hidden;
		background-image:
			linear-gradient(#edf0eb 1px, transparent 1px),
			linear-gradient(90deg, #edf0eb 1px, transparent 1px);
		background-size: 1.1rem 1.1rem;
	}

	.plan-block,
	.plan-line {
		position: absolute;
		display: block;
	}

	.plan-block {
		border: 1px solid #8b9188;
		background: rgb(205 233 157 / 44%);
	}

	.block-a {
		inset: 16% 44% 49% 10%;
	}
	.block-b {
		inset: 52% 16% 12% 36%;
	}
	.block-c {
		top: 17%;
		right: 13%;
		width: 22%;
		height: 25%;
		background: rgb(167 204 229 / 40%);
	}
	.plan-line {
		background: #747a72;
	}
	.line-a {
		top: 47%;
		left: 8%;
		width: 79%;
		height: 1px;
		transform: rotate(-8deg);
	}
	.line-b {
		top: 8%;
		left: 61%;
		width: 1px;
		height: 78%;
		transform: rotate(12deg);
	}
	.north {
		position: absolute;
		top: 0.8rem;
		right: 0.8rem;
		font-size: 0.62rem;
		font-weight: 700;
	}

	.brief-notes {
		padding: 1.25rem;
	}

	.brief-notes h4 {
		max-width: 16ch;
		margin-top: 0.5rem;
		font-size: 1.25rem;
		font-weight: 550;
		line-height: 1.15;
		letter-spacing: -0.035em;
	}

	.brief-notes > p:not(.label) {
		margin-top: 0.8rem;
		font-size: 0.74rem;
		line-height: 1.55;
		color: #737970;
	}

	.progress-row {
		display: flex;
		justify-content: space-between;
		margin-top: 1.5rem;
		font-size: 0.66rem;
	}

	.progress-track {
		height: 0.3rem;
		margin-top: 0.45rem;
		overflow: hidden;
		border-radius: 99px;
		background: #e6e8e3;
	}

	.progress-track span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: #92b957;
	}

	.people {
		display: flex;
		align-items: center;
		margin-top: 1.4rem;
	}

	.people i {
		display: grid;
		width: 1.75rem;
		aspect-ratio: 1;
		place-items: center;
		margin-right: -0.3rem;
		border: 2px solid white;
		border-radius: 50%;
		background: #e4e7e1;
		font-size: 0.52rem;
		font-style: normal;
		font-weight: 700;
	}

	.people span {
		margin-left: 0.75rem;
		font-size: 0.62rem;
		color: #7c8179;
	}

	@media (max-width: 640px) {
		.workspace {
			grid-template-columns: 3.5rem minmax(0, 1fr);
			min-height: 40rem;
		}

		.summary-grid {
			grid-template-columns: 1fr 1fr;
		}

		.summary-grid div:last-child {
			display: none;
		}

		.list-labels,
		.project-row {
			grid-template-columns: minmax(0, 1fr) 5rem;
		}

		.list-labels span:nth-child(2),
		.status {
			display: none;
		}

		.project-name {
			grid-template-columns: 3.2rem minmax(0, 1fr);
		}

		.project-name small {
			display: none;
		}

		.brief-layout {
			grid-template-columns: 1fr;
		}

		.brief-notes {
			display: none;
		}
	}
</style>
