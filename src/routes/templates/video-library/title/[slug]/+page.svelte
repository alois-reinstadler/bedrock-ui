<script lang="ts">
	import PlayIcon from '@lucide/svelte/icons/play';
	import { base, films, poster, runtime, genreSlug } from '#lib/templates/video-library/catalog.js';
	import { getLibrary } from '#lib/templates/video-library/library.svelte.js';
	import FilmRail from '#lib/templates/video-library/FilmRail.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const library = getLibrary();
	const film = $derived(data.film);
</script>

<svelte:head><title>{film.title} — Frame</title></svelte:head>
<section class="frame-hero detail-hero" aria-labelledby="film-title">
	<img class="hero-image" src={poster(film)} alt={`Scene from ${film.title}`} />
	<div class="hero-shade"></div>
	<div class="hero-copy">
		<a class="back-link" href={base}><span aria-hidden="true">←</span> Browse films</a>
		<p class="eyebrow">{film.kind} · BLENDER OPEN CINEMA</p>
		<h1 id="film-title" class="detail-title">{film.title}</h1>
		<p class="hero-tagline">{film.tagline}</p>
		<p class="film-meta">
			{film.year}<span>·</span>{runtime(film)}<span>·</span>{film.genres.join(' / ')}
		</p>
		<div class="film-actions">
			<a class="frame-button primary" href={`${base}/watch/${film.slug}`}
				><PlayIcon size={17} fill="currentColor" aria-hidden="true" />
				{library.progress[film.slug] ? 'Resume' : 'Play'}
				{film.kind === 'Trailer' ? 'trailer' : 'film'}</a
			><button
				class="frame-button secondary"
				aria-pressed={library.saved.includes(film.slug)}
				onclick={() => library.toggle(film.slug)}
				>{library.saved.includes(film.slug) ? '✓ In my list' : '+ My list'}</button
			>
		</div>
	</div>
</section>
<section class="film-detail">
	<div>
		<h2>About the film</h2>
		<p>{film.description}</p>
		{#if film.slug === 'sintel'}<p class="detail-note">
				This title includes the official 52-second trailer. Visit the filmmaker’s site for the full
				film.
			</p>{/if}
	</div>
	<dl>
		<div>
			<dt>Directed by</dt>
			<dd>{film.director}</dd>
		</div>
		<div>
			<dt>Genres</dt>
			<dd>
				{#each film.genres as genre, i (genre)}{#if i}
						·
					{/if}<a href={`${base}/genres/${genreSlug(genre)}`}>{genre}</a>{/each}
			</dd>
		</div>
		<div>
			<dt>Creator</dt>
			<dd><a href={film.website} target="_blank" rel="noreferrer">{film.credit} ↗</a></dd>
		</div>
		<div>
			<dt>License</dt>
			<dd><a href={film.licenseUrl} target="_blank" rel="noreferrer">{film.license} ↗</a></dd>
		</div>
	</dl>
</section>
<FilmRail title="More to discover" items={films.filter((item) => item.slug !== film.slug)} />
