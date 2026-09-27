<script lang="ts">
	import { base, genres, genreSlug } from '#lib/templates/video-library/catalog.js';
	import FilmCard from '#lib/templates/video-library/FilmCard.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head><title>{data.genre} — Frame</title></svelte:head>
<section class="catalog-page">
	<p class="eyebrow">FIND YOUR NEXT FILM</p>
	<h1>{data.genre}</h1>
	<nav class="genre-links" aria-label="Film genres">
		{#each genres as genre (genre)}<a
				href={`${base}/genres/${genreSlug(genre)}`}
				aria-current={genre === data.genre ? 'page' : undefined}>{genre}</a
			>{/each}
	</nav>
	<div class="film-grid">
		{#each data.films as film (film.slug)}<FilmCard {film} />{/each}
	</div>
</section>
