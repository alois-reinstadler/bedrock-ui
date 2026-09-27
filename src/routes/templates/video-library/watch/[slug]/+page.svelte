<script lang="ts">
	import PlayIcon from '@lucide/svelte/icons/play';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { untrack } from 'svelte';
	import { VideoPlayer } from '#lib/bedrock/ui/video-player';
	import { base, films, poster, source } from '#lib/templates/video-library/catalog.js';
	import { getLibrary } from '#lib/templates/video-library/library.svelte.js';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	const library = getLibrary();
	const film = $derived(data.film);
	const next = $derived(
		films[(films.findIndex((item) => item.slug === film.slug) + 1) % films.length]
	);
	let ended = $state(false);
	function setup(video: HTMLVideoElement, slug: string) {
		ended = false;

		let lastSaved = -1;
		function restore() {
			const resume = untrack(() => library.progress[slug] ?? 0);
			if (resume && Number.isFinite(video.duration))
				video.currentTime = Math.min(resume, video.duration - 2);
		}
		function save() {
			const second = Math.floor(video.currentTime);
			if (second === lastSaved || !Number.isFinite(video.duration)) return;
			lastSaved = second;
			library.remember(slug, video.currentTime, video.duration);
		}
		function finish() {
			ended = true;
			library.remember(slug, video.duration, video.duration);
		}
		if (video.readyState >= 1) requestAnimationFrame(restore);
		video.addEventListener('loadedmetadata', restore);
		video.addEventListener('timeupdate', save);
		video.addEventListener('pause', save);
		video.addEventListener('ended', finish);
		window.addEventListener('pagehide', save);
		return () => {
			save();
			video.removeEventListener('loadedmetadata', restore);
			video.removeEventListener('timeupdate', save);
			video.removeEventListener('pause', save);
			video.removeEventListener('ended', finish);
			window.removeEventListener('pagehide', save);
		};
	}
</script>

<svelte:head><title>Watch {film.title} — Frame</title></svelte:head>
<section class="watch-screen" aria-label={`Watching ${film.title}`}>
	<header class="watch-header">
		<a href={`${base}/title/${film.slug}`} aria-label={`Back to ${film.title}`}
			><ArrowLeftIcon size={22} aria-hidden="true" /> <span>Back to film</span></a
		>
		<div>
			<p>NOW PLAYING</p>
			<h1>{film.title}</h1>
		</div>
		<a class="watch-home" href={base}>FRAME<span>●</span></a>
	</header>
	<div class="watch-player">
		{#key film.slug}<VideoPlayer
				src={source(film)}
				poster={poster(film)}
				label={`${film.title} player`}
				mediaSetup={(video) => setup(video, film.slug)}
				autoplay
				preload="metadata"
				captions={film.slug === 'tears-of-steel'
					? [{ src: `${base}/tears-of-steel.vtt`, srclang: 'en', label: 'English' }]
					: []}
				class="h-full w-full rounded-none border-0 bg-black shadow-none"
			/>{/key}
	</div>
	<footer class="watch-footer">
		<p>{film.kind} <span>·</span> Directed by {film.director}</p>
		<a href={`${base}/watch/${next.slug}`}>{ended ? 'Play next' : 'Up next'}: {next.title} →</a>
	</footer>
	{#if ended}<div class="watch-next">
			<p>THE STORY CONTINUES</p>
			<h2>{next.title}</h2>
			<a class="frame-button primary" href={`${base}/watch/${next.slug}`}
				><PlayIcon size={17} fill="currentColor" aria-hidden="true" /> Play next</a
			><a href={base}>Back to browsing</a>
		</div>{/if}
</section>
