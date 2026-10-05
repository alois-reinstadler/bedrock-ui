<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { tracks, collections, formatTime } from '#lib/templates/music-player/data.js';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import { albumMotion } from '#lib/templates/music-player/motion.js';
	import { albumScrollHeader } from '#lib/templates/music-player/scroll-header.js';
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
<section
	class="album-header"
	data-album-layout
	{@attach (element) => {
		// Reset the collapse when the persistent album route changes collection.
		void collection.id;
		return albumScrollHeader(element);
	}}
>
	<div class="cover-stage">
		{#key collection.id}<img
				data-album-cover
				src={collection.artwork}
				alt={`${collection.title} collection cover`}
				in:albumMotion
				out:albumMotion
			/>{/key}
	</div>
	<div class="album-copy">
		<p class="eyebrow">DRIFT COLLECTION · {collection.genre.toUpperCase()}</p>
		<div class="title-stage">
			{#key collection.id}<h1 data-album-title aria-label={collection.title}>
					{#each collection.title.split(' ') as word, index (`${collection.id}-${index}`)}<span
							aria-hidden="true"
							in:albumMotion|global={{ delay: 40 + index * 35 }}
							out:albumMotion|global={{ delay: index * 20 }}>{word}</span
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
	<Button
		class="primary-button"
		onclick={() => player.play(items[0], items)}
		aria-label="Play collection"
		><Play size={15} fill="currentColor" /><span class="action-label">Play collection</span></Button
	>
	<Button
		variant="ghost"
		type="button"
		class={[
			'control-templates-music-player-album-slug-page h-auto whitespace-normal',
			'outline-button'
		]}
		aria-label={player.saved.includes(collection.id) ? 'In your library' : 'Save collection'}
		aria-pressed={player.saved.includes(collection.id)}
		onclick={() => player.save(collection.id)}
		>{#if player.saved.includes(collection.id)}<Check size={16} />{:else}<Plus
				size={16}
			/>{/if}<span class="action-label"
			>{player.saved.includes(collection.id) ? 'In your library' : 'Save collection'}</span
		></Button
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
		align-items: start;
		padding: 12px 0 35px;
		isolation: isolate;
	}
	.cover-stage {
		display: grid;
		aspect-ratio: 1;
		isolation: isolate;
		transform: translate3d(0, var(--album-cover-y, 0px), 0) scale(var(--album-scale, 1));
		transform-origin: center center;
		opacity: var(--album-cover-opacity, 1);
		will-change: transform, opacity;
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
	}
	.album-copy .eyebrow {
		line-height: 1.5;
		min-height: 1.5em;
	}
	.title-stage {
		display: grid;
		margin: 12px 0;
		transform: translate3d(0, var(--album-title-y, 0px), 0) scale(var(--album-title-scale, 1));
		transform-origin: left center;
		opacity: var(--album-title-opacity, 1);
		will-change: transform, opacity;
	}
	.title-stage h1 {
		grid-area: 1/1;
		max-width: 500px;
		font-size: clamp(28px, 12cqi, 64px);
		min-height: 2.04em;
		letter-spacing: -2.8px;
		line-height: 1.02;
	}
	.title-stage h1 span {
		display: block;
	}
	.description {
		font-size: 13px;
		color: var(--music-muted);
		line-height: 1.6;
		max-width: 480px;
		min-height: 3.2em;
	}
	.album-meta {
		display: grid;
		grid-template-rows: repeat(2, 1.8em);
		margin-top: 12px;
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
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		min-height: 80px;
		margin-inline: calc(-1 * var(--music-gutter));
		padding: 16px var(--music-gutter);
		background: var(--background);
	}
	.album-actions :global(button) {
		flex-shrink: 0;
	}
	.album-copy .eyebrow,
	.description,
	.album-meta {
		opacity: var(--album-details-opacity, 1);
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
			min-height: 4.8em;
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
			min-height: 3em;
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
			height: 74px;
			min-height: 74px;
		}
		.more {
			margin-top: 35px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cover-stage,
		.title-stage {
			transform: none;
		}
	}
	:global([data-bedrock-motion='reduced']) :is(.cover-stage, .title-stage) {
		transform: none;
	}
</style>
