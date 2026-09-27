<script lang="ts">
	import { page } from '$app/state';
	import { films } from '#lib/templates/video-library/catalog.js';
	import FilmCard from '#lib/templates/video-library/FilmCard.svelte';
	const query = $derived(
		typeof window !== 'undefined' ? (page.url.searchParams.get('q') ?? '').trim() : ''
	);
	const results = $derived(
		query
			? films.filter((film) =>
					[film.title, film.director, ...film.genres]
						.join(' ')
						.toLowerCase()
						.includes(query.toLowerCase())
				)
			: films
	);
</script>

<svelte:head><title>Search — Frame</title></svelte:head>
<section class="catalog-page">
	<p class="eyebrow">SEARCH FRAME</p>
	<h1>{query ? `Results for “${query}”` : 'Explore all films'}</h1>
	<p class="catalog-intro" role="status">
		{results.length}
		{results.length === 1 ? 'title' : 'titles'}
	</p>
	{#if results.length}<div class="film-grid">
			{#each results as film (film.slug)}<FilmCard {film} />{/each}
		</div>{:else}<div class="frame-empty">
			<h2>No films found.</h2>
			<p>Try a title, genre, or director.</p>
		</div>{/if}
</section>
