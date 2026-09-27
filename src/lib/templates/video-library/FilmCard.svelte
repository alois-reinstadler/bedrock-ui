<script lang="ts">
	import PlayIcon from '@lucide/svelte/icons/play';
	import { base, poster, runtime, type Film } from './catalog.js';
	import { getLibrary } from './library.svelte.js';
	let { film, resume = false }: { film: Film; resume?: boolean } = $props();
	const library = getLibrary();
</script>

<article class="film-card">
	<a
		class="film-image"
		href={`${base}/${resume ? 'watch' : 'title'}/${film.slug}`}
		aria-label={`${resume ? 'Resume' : 'View'} ${film.title}`}
	>
		<img src={poster(film)} alt="" loading="lazy" width="960" height="540" />
		<span class="film-type">{film.kind}</span><span class="film-play" aria-hidden="true"
			><PlayIcon size={17} fill="currentColor" /></span
		>
		{#if resume}<span class="film-progress"
				><span
					style={`width:${Math.min(100, ((library.progress[film.slug] ?? 0) / film.duration) * 100)}%`}
				></span></span
			>{/if}
	</a>
	<div class="film-info">
		<div>
			<a href={`${base}/title/${film.slug}`}>{film.title}</a>
			<p>{film.year} <span>·</span> {runtime(film)} <span>·</span> {film.genres[0]}</p>
		</div>
		<button
			class="save-small"
			aria-label={`${library.saved.includes(film.slug) ? 'Remove' : 'Add'} ${film.title} ${library.saved.includes(film.slug) ? 'from' : 'to'} my list`}
			aria-pressed={library.saved.includes(film.slug)}
			onclick={() => library.toggle(film.slug)}
			>{library.saved.includes(film.slug) ? '✓' : '+'}</button
		>
	</div>
</article>
