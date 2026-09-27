<script lang="ts">
	import { base, films } from '#lib/templates/video-library/catalog.js';
	import { getLibrary } from '#lib/templates/video-library/library.svelte.js';
	import FilmCard from '#lib/templates/video-library/FilmCard.svelte';
	const library = getLibrary();
	const saved = $derived(films.filter((film) => library.saved.includes(film.slug)));
</script>

<svelte:head><title>My list — Frame</title></svelte:head>
<section class="catalog-page">
	<p class="eyebrow">YOUR PERSONAL CINEMA</p>
	<h1>My list<span>{saved.length}</span></h1>
	<p class="catalog-intro">The ones you want to come back to.</p>
	{#if saved.length}<div class="film-grid">
			{#each saved as film (film.slug)}<FilmCard {film} />{/each}
		</div>{:else}<div class="frame-empty">
			<span>+</span>
			<h2>Your next movie night starts here.</h2>
			<p>Add a film to your list and it will be waiting for you.</p>
			<a class="frame-button primary" href={base}>Find a film</a>
		</div>{/if}
</section>
