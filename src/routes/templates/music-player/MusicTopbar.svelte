<script lang="ts">
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Button } from '#lib/bedrock/ui/button';
	import { page } from '$app/state';
	import { browser } from '$app/env';

	import { Input } from '#lib/bedrock/ui/input';
	import { collections, tracks } from '#lib/templates/music-player/data.js';

	import Play from '@lucide/svelte/icons/play';

	import Search from '@lucide/svelte/icons/search';

	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	const player = usePlayer();

	const base = '/templates/music-player';
	const listeningScreen = $derived(
		page.url.pathname === `${base}/lyrics` || page.url.pathname === `${base}/visualizer`
	);
	const headerCollection = $derived(
		collections.find((collection) => page.url.pathname === `${base}/album/${collection.id}`)
	);
</script>

<header class={['topbar', { 'album-topbar': !!headerCollection }]} data-album-topbar>
	{#if listeningScreen}
		<IconButton
			icon={ArrowLeft}
			label="Back to collection"
			href={`${base}/album/${player.current.collection}`}
		/>
		<strong class="listening-title"
			>{page.url.pathname.endsWith('/lyrics') ? 'Lyrics' : 'Visualizer'}</strong
		>
		<IconButton icon={Search} label="Search music" href={`${base}/discover`} />
	{:else if headerCollection}
		<IconButton icon={ArrowLeft} label="Back to music" href={base} />
		<div class="album-topbar-content">
			<div class="compact-album" data-album-compact inert aria-hidden="true">
				<Button
					size="icon"
					class="compact-play rounded-full"
					aria-label="Play collection from header"
					onclick={() => {
						const items = tracks.filter((track) => headerCollection?.trackIds.includes(track.id));
						if (items.length) player.play(items[0], items);
					}}><Play size={16} fill="currentColor" /></Button
				>
				<img src={headerCollection.artwork} alt="" />
				<strong>{headerCollection.title}</strong>
			</div>
		</div>
		<IconButton icon={Search} label="Search music" href={`${base}/discover`} />
	{:else}
		<form action={`${base}/discover`}>
			<Search size={18} /><Input
				name="q"
				aria-label="Search music"
				placeholder="Search songs, artists, genres"
				value={browser ? (page.url.searchParams.get('q') ?? '') : ''}
			/>
		</form>
		<span class="top-note">A soundtrack for your every day.</span>
	{/if}
</header>

<style>
	.listening-title {
		flex: 1;
		font-size: 15px;
	}

	.topbar {
		height: 77px;
		flex: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 16px 36px;
		border-bottom: 1px solid var(--border);
	}
	.album-topbar {
		position: relative;
		z-index: 4;
		gap: 16px;
		background: var(--background);
	}
	.album-topbar-content {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 40px;
	}
	.compact-album {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 40px;
		min-width: 0;
		opacity: var(--album-reveal, 0);
		transform: translate3d(0, calc((1 - var(--album-reveal, 0)) * 14px), 0)
			scale(calc(0.96 + var(--album-reveal, 0) * 0.04));
		transform-origin: left center;
		will-change: transform, opacity;
	}
	.compact-album img {
		width: 34px;
		height: 34px;
		border-radius: 4px;
		object-fit: cover;
	}
	.compact-album strong {
		font-size: 18px;
		letter-spacing: -0.4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	@media (max-width: 680px) {
		.album-topbar {
			gap: 10px;
		}
		.compact-album {
			gap: 9px;
		}
		.compact-album img {
			display: none;
		}
		.compact-album strong {
			font-size: 15px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.compact-album {
			transform: none;
		}
	}
	:global([data-bedrock-motion='reduced']) .compact-album {
		transform: none;
	}
	.topbar form {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--music-muted);
		width: min(390px, 100%);
	}
	.topbar :global(input) {
		padding: 10px 12px;
		border: 0;
		box-shadow: none;
		width: 100%;
		outline: none;
		font-size: 12px;
		background: transparent;
	}
	.top-note {
		font-size: 11px;
		color: var(--music-muted);
		white-space: nowrap;
	}

	@media (max-width: 1050px) {
		.topbar {
			padding-inline: 24px;
		}
		.top-note {
			display: none;
		}
	}
	@media (max-width: 680px) {
		.topbar {
			height: 60px;
			padding: 12px 20px;
		}
	}
</style>
