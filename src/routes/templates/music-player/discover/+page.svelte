<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { collections, genres, tracks } from '#lib/templates/music-player/data.js';
	import CollectionGrid from '#lib/templates/music-player/CollectionGrid.svelte';
	import TrackList from '#lib/templates/music-player/TrackList.svelte';
	const query = $derived(browser ? (page.url.searchParams.get('q') ?? '') : '');
	const genre = $derived(browser ? (page.url.searchParams.get('genre') ?? 'All') : 'All');
	const sort = $derived(browser ? (page.url.searchParams.get('sort') ?? 'curated') : 'curated');
	const results = $derived.by(() => {
		const list = tracks.filter(
			(track) =>
				(genre === 'All' || track.genre === genre) &&
				`${track.title} ${track.artist} ${track.genre}`.toLowerCase().includes(query.toLowerCase())
		);
		return sort === 'title' ? list.sort((a, b) => a.title.localeCompare(b.title)) : list;
	});
	function filter(key: string, value: string) {
		const url = new URL(page.url.href);
		if (value === 'All' || value === 'curated') url.searchParams.delete(key);
		else url.searchParams.set(key, value);
		void goto(url, { reset: false });
	}
</script>

<svelte:head><title>Discover — Drift</title></svelte:head>
<div class="page-heading">
	<p class="eyebrow">STEP OUTSIDE YOUR ROTATION</p>
	<h1>{query ? `Results for “${query}”` : 'Discover'}</h1>
	<p>Eight NCS classics. Find your sound, from house to drum &amp; bass.</p>
</div>
<div class="genre-filters" aria-label="Filter by genre">
	{#each ['All', ...genres] as item (item)}<button
			class:active={genre === item}
			aria-pressed={genre === item}
			onclick={() => filter('genre', item)}>{item}</button
		>{/each}
</div>
{#if !query}<CollectionGrid
		items={collections.filter(
			(item) =>
				genre === 'All' ||
				tracks.some((track) => item.trackIds.includes(track.id) && track.genre === genre)
		)}
	/>{/if}
<section>
	<div class="section-heading">
		<h2>{query ? `${results.length} songs` : 'Explore the tracks'}</h2>
		<label
			>Sort by <select
				aria-label="Sort tracks"
				value={sort}
				onchange={(e) => filter('sort', e.currentTarget.value)}
				><option value="curated">Curated order</option><option value="title">Track title</option
				></select
			></label
		>
	</div>
	<TrackList
		items={results}
		listKey={`${query}-${genre}-${sort}`}
		empty="No matching tracks. Try another title, artist, or genre."
	/>
</section>

<style>
	.genre-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 30px;
	}
	.genre-filters button {
		font-size: 11px;
		padding: 9px 18px;
		border: 1px solid var(--border);
		border-radius: 25px;
	}
	.genre-filters button.active {
		background: var(--foreground);
		color: var(--background);
		border-color: var(--foreground);
	}
	section {
		margin-top: 38px;
	}
	label {
		font-size: 10px;
		color: var(--music-muted);
		display: flex;
		gap: 8px;
		align-items: center;
	}
	select {
		padding: 8px;
		background: var(--background);
		border: 1px solid var(--border);
		border-radius: 6px;
		font-size: 10px;
	}
</style>
