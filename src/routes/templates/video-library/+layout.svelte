<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import { base, genres, genreSlug } from '#lib/templates/video-library/catalog.js';
	import { Library, setLibrary } from '#lib/templates/video-library/library.svelte.js';
	import './frame.css';
	let { children }: { children: Snippet } = $props();
	const library = new Library();
	setLibrary(library);
	let routeContent: HTMLElement | undefined;
	let routeAnimation: Animation | undefined;
	let navigationVersion = 0;

	function attachRouteContent(element: HTMLElement) {
		routeContent = element;
		return () => {
			navigationVersion += 1;
			routeAnimation?.cancel();
			routeContent = undefined;
		};
	}

	onMount(() => {
		library.load();
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const stopMotion = () => {
			if (motion.matches) routeAnimation?.cancel();
		};
		motion.addEventListener('change', stopMotion);
		return () => motion.removeEventListener('change', stopMotion);
	});

	onNavigate(async (navigation) => {
		const version = ++navigationVersion;
		const opacity = routeContent ? getComputedStyle(routeContent).opacity : '1';
		routeAnimation?.cancel();
		const isVideoRoute = (pathname: string | undefined) =>
			pathname === base || pathname?.startsWith(`${base}/`);
		if (
			!routeContent ||
			!isVideoRoute(navigation.from?.url.pathname) ||
			!isVideoRoute(navigation.to?.url.pathname) ||
			(navigation.from?.url.pathname === navigation.to?.url.pathname &&
				navigation.from?.url.search === navigation.to?.url.search) ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		)
			return;

		// Fade only the routed content. The header, account menu and template picker stay put.
		routeAnimation = routeContent.animate([{ opacity }, { opacity: 0.45 }], {
			duration: 100,
			easing: 'ease-out',
			fill: 'forwards'
		});
		void navigation.complete.catch(() => {
			if (version === navigationVersion) routeAnimation?.cancel();
		});
		await routeAnimation.finished.catch(() => undefined);
		return () => {
			if (version !== navigationVersion || !routeContent) return;
			routeAnimation?.cancel();
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			routeAnimation = routeContent.animate([{ opacity: 0.45 }, { opacity: 1 }], {
				duration: 180,
				easing: 'ease-out'
			});
		};
	});
	const watching = $derived(page.url.pathname.includes('/watch/'));
</script>

<div class="frame-app" data-template="video-library" data-ready={library.ready}>
	<a href="#frame-content" class="frame-skip">Skip to content</a>
	{#if !watching}
		<header class="frame-header">
			<a class="frame-brand" href={base} aria-label="Frame home">FRAME<span>●</span></a>
			<nav aria-label="Frame navigation">
				<a href={base} aria-current={page.url.pathname === base ? 'page' : undefined}>Home</a>
				<details class="genre-menu">
					<summary>Genres <span>⌄</span></summary>
					<div>
						{#each genres as genre (genre)}<a
								onclick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
								href={`${base}/genres/${genreSlug(genre)}`}>{genre}</a
							>{/each}
					</div>
				</details>
				<a
					href={`${base}/my-list`}
					aria-current={page.url.pathname.endsWith('/my-list') ? 'page' : undefined}
					>My list{#if library.saved.length}<span class="list-count">{library.saved.length}</span
						>{/if}</a
				>
			</nav>
			<form action={`${base}/search`} class="frame-search">
				<label for="frame-query" class="sr-only">Search films</label><span aria-hidden="true"
					>⌕</span
				><input
					id="frame-query"
					type="search"
					name="q"
					placeholder="Titles, genres, people"
				/><button aria-label="Search films" type="submit">↵</button>
			</form>
			<details class="account-menu">
				<summary aria-label="Your account"
					><span>JD</span><span class="account-chevron">⌄</span></summary
				>
				<div>
					<strong>Jamie Davis</strong><small>Your personal cinema</small><a href={`${base}/my-list`}
						>My list <span>{library.saved.length}</span></a
					><a href={`${base}/#continue-watching`}>Continue watching</a><a
						href={`${base}/#film-credits`}>Film credits</a
					>
				</div>
			</details>
		</header>
	{/if}
	<main id="frame-content" tabindex="-1" {@attach attachRouteContent}>{@render children()}</main>
	{#if !watching}<footer id="film-credits" class="frame-footer">
			<a class="frame-brand" href={base}>FRAME<span>●</span></a>
			<p>Good stories deserve a screen.</p>
			<a href={`${base}/media-credits.md`}>Films &amp; creative credits ↗</a><span
				>Films by Blender Foundation and independent creators.</span
			>
		</footer>{/if}
	<p class="sr-only" role="status">{library.notice}</p>
</div>
