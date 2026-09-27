<script lang="ts">
	import { tracks, formatTime } from '#lib/templates/music-player/data.js';
</script>

<svelte:head><title>Music credits — Drift</title></svelte:head>
<div class="page-heading">
	<p class="eyebrow">MADE BY REAL MUSICIANS</p>
	<h1>Music & credits</h1>
	<p>Eight classic NCS releases. Full tracks, original artists, original artwork.</p>
</div>
<div class="credits-copy">
	<p>
		Music provided by <a href="https://ncs.io/">NoCopyrightSounds</a>. These are the full recordings
		from each official NCS release, with the original release artwork.
	</p>
	<p>
		Drift collections are editorial playlists. Explore the artists and original videos below, or
		<a href="/templates/music-player/media-credits.md">download full credits</a>.
	</p>
</div>
<div class="credit-list">
	{#each tracks as track (track.id)}<div>
			<strong>{track.title}</strong><span
				>{track.artist} · {track.genre} · {formatTime(track.duration)}</span
			><small>Music provided by NoCopyrightSounds · NCS release</small>
			<div class="credit-links">
				<a href={track.source}>Official NCS release ↗</a><a href={track.youtube}
					>Watch on YouTube ↗</a
				>
			</div>
		</div>{/each}
</div>

<style>
	.credits-copy {
		font-size: 13px;
		color: var(--music-muted);
		line-height: 1.9;
		max-width: 680px;
	}
	.credits-copy p {
		margin-bottom: 15px;
	}
	.credits-copy a,
	.credit-list a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.credit-list {
		margin-top: 30px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 25px;
	}
	.credit-list > div {
		display: grid;
		gap: 7px;
		border-top: 1px solid var(--border);
		padding-top: 18px;
	}
	.credit-links {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
	}
	.credit-list strong {
		font-size: 14px;
	}
	.credit-list span,
	.credit-list a {
		font-size: 11px;
	}
	.credit-list small {
		font-size: 10px;
		color: var(--music-muted);
	}
	@media (max-width: 680px) {
		.credit-list {
			grid-template-columns: 1fr;
		}
	}
</style>
