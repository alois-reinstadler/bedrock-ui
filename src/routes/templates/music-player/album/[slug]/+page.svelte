<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { tracks, collections, formatTime } from '#lib/templates/music-player/data.js';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import { albumMotion } from '#lib/templates/music-player/motion.js';
	import TrackList from '#lib/templates/music-player/TrackList.svelte';
	import CollectionGrid from '#lib/templates/music-player/CollectionGrid.svelte';
	import Play from '@lucide/svelte/icons/play';
	import Plus from '@lucide/svelte/icons/plus';
	import Check from '@lucide/svelte/icons/check';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const player = usePlayer();
	const collection = $derived(data.collection);
	const items = $derived(tracks.filter((track) => collection.trackIds.includes(track.id)));
</script>

<svelte:head><title>{collection.title} — Drift</title></svelte:head>
<section class="album-header" data-album-layout>
	<div class="cover-stage">
		{#key collection.id}<img
				data-album-cover
				src={collection.artwork}
				alt={`${collection.title} collection cover`}
				in:albumMotion={{ duration: 280 }}
				out:albumMotion={{ duration: 180 }}
			/>{/key}
	</div>
	<div class="album-copy">
		<p class="eyebrow">DRIFT COLLECTION · {collection.genre.toUpperCase()}</p>
		<div class="title-stage">
			{#key collection.id}<h1 data-album-title aria-label={collection.title}>
					{#each collection.title.split(' ') as word, index (`${collection.id}-${index}`)}<span
							aria-hidden="true"
							in:albumMotion|global={{ delay: 40 + index * 35 }}
							out:albumMotion|global={{ delay: index * 20, duration: 160 }}>{word}</span
						>{/each}
				</h1>{/key}
		</div>
		<p class="description">{collection.description}</p>
		<p class="album-meta">
			<span>Curated by Drift · NCS classics</span>
			<span
				>{items.length} songs, {formatTime(
					items.reduce((sum, track) => sum + track.duration, 0)
				)}</span
			>
		</p>
	</div>
</section>
<div class="album-actions">
	<Button class="primary-button" onclick={() => player.play(items[0], items)}
		><Play size={15} fill="currentColor" />Play collection</Button
	><button
		class="outline-button"
		aria-pressed={player.saved.includes(collection.id)}
		onclick={() => player.save(collection.id)}
		>{#if player.saved.includes(collection.id)}<Check size={16} />{:else}<Plus
				size={16}
			/>{/if}{player.saved.includes(collection.id) ? 'In your library' : 'Save collection'}</button
	>
</div>
<TrackList {items} listKey={collection.id} />
<p class="attribution">
	Released by <a href="https://ncs.io/">NoCopyrightSounds</a>
	· <a href="/templates/music-player/credits">Track credits</a>
</p>
<section class="more">
	<div class="section-heading">
		<h2>Keep listening</h2>
		<a href="/templates/music-player/discover">Explore all</a>
	</div>
	<CollectionGrid items={collections.filter((item) => item.id !== collection.id)} />
</section>

<style>
	.album-header {
		display: grid;
		grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
		gap: 38px;
		align-items: end;
		padding: 12px 0 35px;
	}
	.cover-stage {
		display: grid;
		aspect-ratio: 1;
		isolation: isolate;
	}
	.cover-stage img {
		grid-area: 1/1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 9px;
		box-shadow: 0 18px 35px #0002;
	}
	.album-copy {
		min-width: 0;
		container-type: inline-size;
		padding-bottom: 7px;
	}
	.album-copy .eyebrow {
		line-height: 1.5;
		min-height: 3em;
	}
	.title-stage {
		display: grid;
		margin: 18px 0;
	}
	.title-stage h1 {
		grid-area: 1/1;
		max-width: 500px;
		font-size: clamp(28px, 12cqi, 78px);
		min-height: 2.04em;
		letter-spacing: -3.6px;
		line-height: 1.02;
	}
	.title-stage h1 span {
		display: block;
	}
	.description {
		font-size: 13px;
		color: var(--music-muted);
		line-height: 1.8;
		max-width: 480px;
		min-height: 3.6em;
	}
	.album-meta {
		display: grid;
		grid-template-rows: repeat(2, 1.8em);
		margin-top: 20px;
		font-size: 10px;
		line-height: 1.8;
	}
	.album-meta span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--music-muted);
	}
	.album-actions {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 22px 0 30px;
		border-top: 1px solid var(--border);
	}
	.attribution {
		margin-top: 20px;
		font-size: 10px;
		color: var(--music-muted);
	}
	.attribution a:hover {
		text-decoration: underline;
	}
	.more {
		margin-top: 48px;
	}
	@media (max-width: 1050px) {
		.album-header {
			grid-template-columns: 180px minmax(0, 1fr);
			gap: 25px;
		}
		.title-stage h1 {
			font-size: clamp(28px, 15cqi, 48px);
			letter-spacing: -2px;
		}
		.description {
			min-height: 5.4em;
		}
		.album-meta {
			font-size: 9px;
		}
	}
	@media (max-width: 680px) {
		.album-header {
			grid-template-columns: 112px minmax(0, 1fr);
			gap: 20px;
			align-items: center;
			padding-top: 0;
			padding-bottom: 22px;
		}
		.title-stage {
			margin: 10px 0;
		}
		.title-stage h1 {
			font-size: clamp(25px, 16cqi, 34px);
			letter-spacing: -1.7px;
		}
		.album-copy .eyebrow {
			font-size: 8px;
		}
		.description {
			display: none;
		}
		.album-meta {
			font-size: 9px;
			margin-top: 10px;
		}
		.album-actions {
			gap: 8px;
			flex-wrap: wrap;
			padding-top: 20px;
		}
		.more {
			margin-top: 35px;
		}
	}
</style>
