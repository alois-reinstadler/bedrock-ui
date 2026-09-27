<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { collections, tracks } from '#lib/templates/music-player/data.js';
	import CollectionGrid from '#lib/templates/music-player/CollectionGrid.svelte';
	import TrackList from '#lib/templates/music-player/TrackList.svelte';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import Play from '@lucide/svelte/icons/play';
	const player = usePlayer();
	const featured = tracks.filter((track) => collections[0].trackIds.includes(track.id));
</script>

<svelte:head><title>Listen now — Drift</title></svelte:head>
<div class="welcome">
	<div>
		<p class="eyebrow">YOUR DAILY SOUNDTRACK</p>
		<h1>Listen now</h1>
	</div>
	<span>NCS classics, on repeat.</span>
</div>
<section class="editorial">
	<div class="editorial-copy">
		<p class="eyebrow">THE NCS ESSENTIALS</p>
		<h2>Turn it<br />up.</h2>
		<p>
			Big drops. Familiar hooks.<br class="desktop-break" /> The tracks you know by heart.
		</p>
		<div>
			<Button class="primary-button" onclick={() => player.play(featured[0], featured)}
				><Play size={15} fill="currentColor" />Start listening</Button
			><a href="/templates/music-player/album/after-hours">Explore collection ↗</a>
		</div>
	</div>
	<img src={collections[0].artwork} alt={`${collections[0].title} collection artwork`} /><span
		class="editorial-number">01 / 04</span
	>
</section>
<section class="collection-section">
	<div class="section-heading">
		<h2>Find your frequency</h2>
		<a href="/templates/music-player/discover">Browse all ↗</a>
	</div>
	<CollectionGrid />
</section>
<section class="rotation">
	<div class="section-heading">
		<h2>In the rotation</h2>
		<span>Handpicked, always</span>
	</div>
	<TrackList items={[tracks[0], tracks[2], tracks[4], tracks[6]]} />
</section>

<style>
	.welcome {
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-bottom: 30px;
	}
	.welcome h1 {
		font-size: 34px;
		margin-top: 8px;
		letter-spacing: -1.3px;
	}
	.welcome > span,
	.rotation .section-heading > span {
		font-size: 11px;
		color: var(--music-muted);
	}
	.editorial {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: 1fr 42%;
		min-height: 320px;
		padding: 38px 42px;
		border-radius: 12px;
		overflow: hidden;
		background: #ddd6cd;
		color: #252426;
	}
	.editorial:after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, #e0d8ce 15%, #d9d5d280, transparent);
		z-index: -1;
	}
	.editorial-copy {
		align-self: center;
		z-index: 1;
	}
	.editorial-copy .eyebrow {
		color: #66616a;
	}
	.editorial h2 {
		font-size: clamp(40px, 5vw, 68px);
		letter-spacing: -3px;
		line-height: 1;
		margin-top: 15px;
		font-weight: 600;
	}
	.editorial-copy > p:last-of-type {
		font-size: 12px;
		line-height: 1.8;
		color: #625c63;
		margin-top: 17px;
	}
	.editorial-copy > div {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-top: 24px;
	}
	.editorial-copy :global(.primary-button) {
		background: #2c292c;
		color: #fff;
	}
	.editorial-copy a {
		font-size: 10px;
	}
	.editorial > img {
		position: absolute;
		width: 53%;
		height: 100%;
		right: 0;
		top: 0;
		object-fit: cover;
		z-index: -2;
	}
	.editorial-number {
		position: absolute;
		bottom: 20px;
		right: 23px;
		color: #fff9;
		font-size: 9px;
		letter-spacing: 2px;
	}
	.collection-section,
	.rotation {
		margin-top: 38px;
	}
	@media (max-width: 1050px) {
		.editorial {
			padding: 30px;
			min-height: 300px;
		}
		.editorial-copy > div {
			gap: 14px;
		}
		.editorial-copy a {
			display: none;
		}
	}
	@media (max-width: 680px) {
		.welcome {
			margin-bottom: 24px;
		}
		.welcome > span {
			display: none;
		}
		.welcome h1 {
			font-size: 30px;
		}
		.editorial {
			padding: 25px;
			min-height: 300px;
			grid-template-columns: 1fr;
		}
		.editorial h2 {
			font-size: 49px;
		}
		.editorial > img {
			width: 65%;
			opacity: 0.65;
		}
		.editorial-copy > p:last-of-type {
			max-width: 205px;
		}
		.desktop-break {
			display: none;
		}
		.collection-section,
		.rotation {
			margin-top: 30px;
		}
	}
</style>
