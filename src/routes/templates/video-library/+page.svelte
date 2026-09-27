<script lang="ts">
	import PlayIcon from '@lucide/svelte/icons/play';
	import InfoIcon from '@lucide/svelte/icons/info';
	import { base, films, poster, runtime } from '#lib/templates/video-library/catalog.js';
	import { getLibrary } from '#lib/templates/video-library/library.svelte.js';
	import FilmRail from '#lib/templates/video-library/FilmRail.svelte';
	const featured = films[0];
	const library = getLibrary();
	const continuing = $derived(films.filter((film) => (library.progress[film.slug] ?? 0) > 0));
</script>

<svelte:head
	><title>Frame — Films worth your time</title><meta
		name="description"
		content="Watch a handpicked collection of open short films, animation and science fiction."
	/></svelte:head
>
<section class="frame-hero" aria-labelledby="featured-title">
	<img
		class="hero-image"
		src={poster(featured)}
		alt="A scene from Tears of Steel"
		fetchpriority="high"
	/>
	<div class="hero-shade"></div>
	<div class="hero-copy">
		<p class="eyebrow"><span></span> TONIGHT’S FEATURE</p>
		<h1 id="featured-title">TEARS<br />OF STEEL</h1>
		<p class="hero-tagline">{featured.tagline}</p>
		<p class="film-meta">
			{featured.year}<span>·</span>{runtime(featured)}<span>·</span>Science fiction
		</p>
		<p class="hero-description">{featured.description}</p>
		<div class="film-actions">
			<a class="frame-button primary" href={`${base}/watch/${featured.slug}`}
				><PlayIcon size={17} fill="currentColor" aria-hidden="true" />
				{library.progress[featured.slug] ? 'Resume film' : 'Play film'}</a
			><a class="frame-button secondary" href={`${base}/title/${featured.slug}`}
				><InfoIcon size={17} aria-hidden="true" /> More info</a
			>
		</div>
	</div>
	<div class="hero-caption">
		<span>01 / 04</span>
		<p>BLENDER OPEN CINEMA</p>
	</div>
</section>
<div class="home-rails">
	{#if continuing.length}<div id="continue-watching">
			<FilmRail title="Pick up where you left off" items={continuing} resume />
		</div>{/if}
	<FilmRail title="Your next great short" items={films} />
	<FilmRail
		title="A little escape"
		items={[films[1], films[2], films[3]]}
		href={`${base}/genres/animation`}
	/>
	<section class="editorial-strip">
		<p class="eyebrow">THE OPEN CINEMA COLLECTION</p>
		<h2>Small films.<br />Entire worlds.</h2>
		<p>
			From the streets of a future Amsterdam to the wilds of Patagonia. Four stories made to be
			shared.
		</p>
		<a href={`${base}/genres/science-fiction`}>Explore science fiction →</a>
	</section>
</div>
