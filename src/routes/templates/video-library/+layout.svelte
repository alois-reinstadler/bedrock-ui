<script lang="ts">
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	import { onMount } from 'svelte';
	import { motionPresets } from '#lib/bedrock/motion/tokens.js';
	import {
		elementPrefersReducedMotion,
		observeMotionReduction
	} from '#lib/bedrock/motion/policy.js';
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
		const stopPolicy = observeMotionReduction(element, (reduced) => {
			if (reduced) routeAnimation?.cancel();
		});
		return () => {
			stopPolicy();
			navigationVersion += 1;
			routeAnimation?.cancel();
			routeContent = undefined;
		};
	}

	onMount(() => {
		library.load();
	});

	onNavigate((navigation) => {
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
			elementPrefersReducedMotion(routeContent)
		)
			return;

		// Fade only the routed content. The header, account menu and template picker stay put.
		routeAnimation = routeContent.animate([{ opacity }, { opacity: 0.45 }], {
			duration: motionPresets.exit.duration,
			easing: `cubic-bezier(${motionPresets.exit.easing.join(',')})`,
			fill: 'forwards'
		});
		void navigation.complete.catch(() => {
			if (version === navigationVersion) routeAnimation?.cancel();
		});
		// Routing commits independently of paint, even if an animation is paused.
		return () => {
			if (version !== navigationVersion || !routeContent) return;
			routeAnimation?.cancel();
			if (elementPrefersReducedMotion(routeContent)) return;
			routeAnimation = routeContent.animate([{ opacity: 0.45 }, { opacity: 1 }], {
				duration: motionPresets.enter.duration,
				easing: `cubic-bezier(${motionPresets.enter.easing.join(',')})`
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
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="genre-menu-trigger"
						>Genres <span aria-hidden="true">⌄</span></DropdownMenu.Trigger
					>
					<DropdownMenu.Content class="frame-menu" preventScroll={false} sideOffset={12}>
						{#each genres as genre (genre)}
							<DropdownMenu.Item>
								{#snippet child({ props })}<a {...props} href={`${base}/genres/${genreSlug(genre)}`}
										>{genre}</a
									>{/snippet}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
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
				><Input
					class={['control-templates-video-library-layout']}
					id="frame-query"
					type="search"
					name="q"
					placeholder="Titles, genres, people"
				/><Button
					variant="ghost"
					class={['control-templates-video-library-layout h-auto whitespace-normal']}
					aria-label="Search films"
					type="submit">↵</Button
				>
			</form>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="account-menu-trigger" aria-label="Your account">
					<span class="account-initials">JD</span><span class="account-chevron" aria-hidden="true"
						>⌄</span
					>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="frame-menu frame-account-menu"
					preventScroll={false}
					align="end"
					sideOffset={12}
				>
					<DropdownMenu.Label
						><strong>Jamie Davis</strong><small>Your personal cinema</small></DropdownMenu.Label
					>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						>{#snippet child({ props })}<a {...props} href={`${base}/my-list`}
								>My list <span>{library.saved.length}</span></a
							>{/snippet}</DropdownMenu.Item
					>
					<DropdownMenu.Item
						>{#snippet child({ props })}<a {...props} href={`${base}/#continue-watching`}
								>Continue watching</a
							>{/snippet}</DropdownMenu.Item
					>
					<DropdownMenu.Item
						>{#snippet child({ props })}<a {...props} href={`${base}/#film-credits`}>Film credits</a
							>{/snippet}</DropdownMenu.Item
					>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
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
