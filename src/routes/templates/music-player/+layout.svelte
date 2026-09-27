<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { Input } from '#lib/bedrock/ui/input';
	import { collections, formatTime, tracks } from '#lib/templates/music-player/data.js';
	import { providePlayer } from '#lib/templates/music-player/player.svelte.js';
	import Icon from '@lucide/svelte/icons/audio-lines';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Next from '@lucide/svelte/icons/skip-forward';
	import Previous from '@lucide/svelte/icons/skip-back';
	import Heart from '@lucide/svelte/icons/heart';
	import Search from '@lucide/svelte/icons/search';
	import Compass from '@lucide/svelte/icons/compass';
	import Library from '@lucide/svelte/icons/library';
	import Clock from '@lucide/svelte/icons/clock-3';
	import Queue from '@lucide/svelte/icons/list-music';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import Repeat from '@lucide/svelte/icons/repeat-2';
	import Volume from '@lucide/svelte/icons/volume-2';
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	const player = providePlayer();
	let queueOpen = $state(false);
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	const base = '/templates/music-player';
	const navigation = [
		{ path: '', label: 'Listen now', icon: Icon },
		{ path: '/discover', label: 'Discover', icon: Compass },
		{ path: '/library', label: 'Your library', icon: Library },
		{ path: '/liked', label: 'Liked songs', icon: Heart },
		{ path: '/recent', label: 'Recently played', icon: Clock }
	];
</script>

<div class="drift" data-music-shell data-ready={ready}>
	<audio
		{@attach player.connect}
		preload="metadata"
		onplay={() => player.handlePlay()}
		onpause={() => player.handlePause()}
		ontimeupdate={(e) => (player.elapsed = e.currentTarget.currentTime)}
		onloadedmetadata={(e) => (player.duration = e.currentTarget.duration)}
		onended={() => player.ended()}
		onerror={() => player.handleError()}
	></audio>
	<aside class="sidebar">
		<a class="brand" href={base}
			><Icon size={24} /><span>drift<span class="brand-dot">.</span></span></a
		>
		<nav aria-label="Music navigation">
			{#each navigation as item (item.path)}<a
					href={base + item.path}
					class:active={page.url.pathname === base + item.path}
					aria-current={page.url.pathname === base + item.path ? 'page' : undefined}
					><item.icon size={19} /><span>{item.label}</span></a
				>{/each}
		</nav>
		<div class="side-heading">YOUR COLLECTIONS <span>{collections.length}</span></div>
		<nav class="collection-nav" aria-label="Collections">
			{#each collections as collection (collection.id)}<a
					href={`${base}/album/${collection.id}`}
					class:active={page.params.slug === collection.id}
					><img src={collection.artwork} alt="" /><span
						><strong>{collection.title}</strong><small>{collection.genre}</small></span
					></a
				>{/each}
		</nav>
		<a class="credits-link" href={`${base}/credits`}>Music & credits ↗</a>
		<div class="listener">
			<span class="avatar">JD</span><span
				><strong>Jamie Davis</strong><small>Personal library</small></span
			>
		</div>
	</aside>
	<div class="workspace">
		<header class="topbar">
			<form action={`${base}/discover`}>
				<Search size={18} /><Input
					name="q"
					aria-label="Search music"
					placeholder="Search songs, artists, genres"
					value={browser ? (page.url.searchParams.get('q') ?? '') : ''}
				/>
			</form>
			<span class="top-note">A soundtrack for your every day.</span>
		</header>
		<main id="music-main">{@render children()}</main>
	</div>
	{#if queueOpen}<aside class="queue-panel" aria-label="Play queue">
			<div class="section-heading">
				<h2>Up next</h2>
				<button class="icon-button" onclick={() => (queueOpen = false)} aria-label="Close queue"
					><X size={20} /></button
				>
			</div>
			<label class="queue-volume"
				>Volume<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={player.volume}
					oninput={(e) => player.setVolume(Number(e.currentTarget.value))}
					aria-label="Queue volume"
					aria-valuetext={`${Math.round(player.volume * 100)}%`}
				/></label
			>
			<p class="eyebrow">PLAYING FROM YOUR QUEUE</p>
			{#each player.queue as id, index (`${id}-${index}`)}{@const track = tracks.find(
					(t) => t.id === id
				)!}<button
					class="queue-track"
					class:current={player.current.id === id}
					onclick={() => player.play(track)}
					><img src={track.artwork} alt="" /><span
						><strong>{track.title}</strong><small>{track.artist}</small></span
					>{#if player.current.id === id}<Icon size={18} />{/if}</button
				>{/each}
		</aside>{/if}
	<footer class="player" data-music-player>
		<div class="playing">
			<a href={`${base}/album/${player.current.collection}`}
				><img src={player.current.artwork} alt="" /></a
			><span><strong>{player.current.title}</strong><small>{player.current.artist}</small></span
			><button
				class="icon-button"
				class:selected={player.liked.includes(player.current.id)}
				aria-label="Like current track"
				aria-pressed={player.liked.includes(player.current.id)}
				onclick={() => player.like(player.current.id)}><Heart size={18} /></button
			>
		</div>
		<div class="transport">
			<button
				class="mobile-queue icon-button"
				aria-label="Open queue"
				onclick={() => (queueOpen = !queueOpen)}><Queue size={18} /></button
			>
			<div class="transport-buttons">
				<button
					class="icon-button secondary-control"
					class:selected={player.shuffle}
					aria-label="Shuffle"
					aria-pressed={player.shuffle}
					onclick={() => (player.shuffle = !player.shuffle)}><Shuffle size={17} /></button
				><button class="icon-button" aria-label="Previous track" onclick={() => player.next(-1)}
					><Previous size={19} /></button
				><button
					class="play-button"
					aria-label={player.playing ? 'Pause playback' : 'Play current track'}
					onclick={() => player.toggle()}
					>{#if player.playing}<Pause size={19} fill="currentColor" />{:else}<Play
							size={19}
							fill="currentColor"
						/>{/if}</button
				><button class="icon-button" aria-label="Next track" onclick={() => player.next()}
					><Next size={19} /></button
				><button
					class="icon-button secondary-control"
					class:selected={player.repeat}
					aria-label="Repeat track"
					aria-pressed={player.repeat}
					onclick={() => (player.repeat = !player.repeat)}><Repeat size={17} /></button
				>
			</div>
			<div class="timeline">
				<time>{formatTime(player.elapsed)}</time><input
					type="range"
					min="0"
					max={player.duration || player.current.duration}
					step="0.1"
					value={player.elapsed}
					oninput={(e) => player.seek(Number(e.currentTarget.value))}
					aria-label="Seek"
				/><time>{formatTime(player.duration || player.current.duration)}</time>
			</div>
		</div>
		<div class="player-tools">
			<button
				class="icon-button"
				class:selected={queueOpen}
				aria-expanded={queueOpen}
				aria-label="Toggle queue"
				onclick={() => (queueOpen = !queueOpen)}><Queue size={20} /></button
			><Volume size={18} /><input
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={player.volume}
				oninput={(e) => player.setVolume(Number(e.currentTarget.value))}
				aria-label="Volume"
				aria-valuetext={`${Math.round(player.volume * 100)}%`}
			/>
		</div>
	</footer>
	<p class="status" role="status">{player.message}</p>
</div>

<style>
	.mobile-queue {
		display: none !important;
	}
	.queue-volume {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 11px;
		margin: 10px 0 20px;
	}
	.queue-volume input {
		width: 100%;
		accent-color: var(--foreground);
	}
	.drift {
		--music-muted: var(--muted-foreground);
		display: grid;
		grid-template-columns: 218px minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr) 92px;
		height: 100dvh;
		min-height: 500px;
		background: var(--background);
		color: var(--foreground);
		font-family: inherit;
	}
	.sidebar {
		border-right: 1px solid var(--border);
		padding: 28px 18px 16px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: auto;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 30px;
		font-weight: 750;
		letter-spacing: -1.5px;
		padding: 0 12px 30px;
	}
	.brand-dot {
		color: #c46b78;
	}
	.brand :global(svg) {
		color: #c46b78;
	}
	.sidebar nav {
		display: grid;
		gap: 4px;
	}
	.sidebar nav a {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 12px;
		border-radius: 8px;
		font-size: 13px;
		color: var(--music-muted);
	}
	.sidebar nav a:hover,
	.sidebar nav a.active {
		background: var(--muted);
		color: var(--foreground);
	}
	.side-heading {
		display: flex;
		justify-content: space-between;
		margin: 32px 12px 14px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--music-muted);
	}
	.sidebar .collection-nav a {
		padding: 8px;
		gap: 11px;
	}
	.collection-nav img {
		width: 38px;
		height: 38px;
		border-radius: 5px;
	}
	.collection-nav span,
	.listener > span:last-child {
		display: grid;
		gap: 3px;
	}
	.collection-nav strong {
		font-size: 12px;
		font-weight: 600;
		color: var(--foreground);
	}
	.collection-nav small,
	.listener small {
		font-size: 10px;
		color: var(--music-muted);
	}
	.credits-link {
		margin-top: auto;
		padding: 30px 12px 20px;
		font-size: 11px;
		color: var(--music-muted);
	}
	.listener {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 6px 0;
		border-top: 1px solid var(--border);
	}
	.avatar {
		display: grid;
		place-items: center;
		background: #cab9a3;
		color: #30281f;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		font-size: 11px;
	}
	.listener strong {
		font-size: 12px;
	}
	.workspace {
		min-height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
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
	main {
		overflow: auto;
		padding: 34px 38px 64px;
		flex: 1;
		min-height: 0;
	}
	.player {
		grid-column: 1/-1;
		border-top: 1px solid var(--border);
		display: grid;
		grid-template-columns: 1fr 1.25fr 1fr;
		align-items: center;
		gap: 30px;
		padding: 12px 25px;
		background: var(--background);
		z-index: 5;
	}
	.playing {
		display: flex;
		align-items: center;
		gap: 13px;
		min-width: 0;
	}
	.playing img {
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}
	.playing > span {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.playing strong {
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.playing small {
		font-size: 10px;
		color: var(--music-muted);
	}
	.transport-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
	}
	.timeline {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
	}
	.timeline time {
		font-size: 9px;
		font-variant-numeric: tabular-nums;
		color: var(--music-muted);
		width: 27px;
	}
	.timeline input {
		width: 100%;
		height: 3px;
		accent-color: var(--foreground);
	}
	.player-tools {
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 14px;
		color: var(--music-muted);
	}
	.player-tools input {
		max-width: 85px;
		width: 100%;
		height: 3px;
		accent-color: var(--foreground);
	}
	.play-button {
		border-radius: 50%;
		background: var(--foreground);
		color: var(--background);
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
	}
	.queue-panel {
		position: absolute;
		right: 0;
		top: 77px;
		bottom: 92px;
		width: min(330px, 100vw);
		background: var(--background);
		padding: 25px;
		z-index: 4;
		overflow: auto;
		box-shadow: -12px 0 40px #0002;
		border-left: 1px solid var(--border);
	}
	.queue-track {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 12px;
		text-align: left;
		padding: 12px 0;
		border-bottom: 1px solid var(--border);
	}
	.queue-track img {
		width: 42px;
		border-radius: 5px;
	}
	.queue-track span {
		display: grid;
		gap: 4px;
		flex: 1;
	}
	.queue-track strong {
		font-size: 12px;
	}
	.queue-track small {
		font-size: 10px;
		color: var(--music-muted);
	}
	.queue-track.current {
		color: #c46b78;
	}
	.status {
		position: fixed;
		bottom: 100px;
		left: 50%;
		translate: -50% 0;
		font-size: 12px;
		background: var(--background);
		border-radius: 8px;
		padding: 8px 14px;
		z-index: 10;
	}
	.status:empty {
		display: none;
	}
	:global(.drift button),
	:global(.drift a),
	:global(.drift input),
	:global(.drift select) {
		-webkit-tap-highlight-color: transparent;
	}
	:global(.drift button) {
		cursor: pointer;
	}
	:global(.drift button:focus-visible),
	:global(.drift a:focus-visible),
	:global(.drift input:focus-visible),
	:global(.drift select:focus-visible) {
		outline: 2px solid #c46b78;
		outline-offset: 4px;
	}
	:global(.drift .icon-button) {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		color: var(--music-muted);
	}
	:global(.drift .icon-button:hover) {
		background: var(--muted);
		color: var(--foreground);
	}
	:global(.drift .selected) {
		color: #c46b78 !important;
	}
	:global(.drift .eyebrow) {
		font-size: 10px;
		letter-spacing: 1.8px;
		font-weight: 650;
		color: var(--music-muted);
	}
	:global(.drift h1) {
		font-size: clamp(30px, 4vw, 55px);
		line-height: 1.07;
		letter-spacing: -2px;
		font-weight: 650;
	}
	:global(.drift h2) {
		font-size: 20px;
		font-weight: 620;
		letter-spacing: -0.6px;
	}
	:global(.drift .section-heading) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 21px;
	}
	:global(.drift .section-heading a) {
		font-size: 11px;
		color: var(--music-muted);
	}
	:global(.drift .primary-button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		padding: 11px 21px;
		border-radius: 24px;
		background: var(--foreground);
		color: var(--background);
		font-size: 12px;
		font-weight: 600;
	}
	:global(.drift .outline-button) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		border: 1px solid var(--border);
		border-radius: 24px;
		font-size: 12px;
	}
	:global(.drift .page-heading) {
		margin-bottom: 32px;
	}
	:global(.drift .page-heading h1) {
		margin: 8px 0 12px;
	}
	:global(.drift .page-heading p:last-child) {
		font-size: 13px;
		color: var(--music-muted);
	}
	@media (max-width: 1050px) {
		.drift {
			grid-template-columns: 185px minmax(0, 1fr);
		}
		.sidebar {
			padding-inline: 10px;
		}
		.topbar {
			padding-inline: 24px;
		}
		.top-note {
			display: none;
		}
		main {
			padding: 26px 24px 50px;
		}
		.player {
			grid-template-columns: 1fr 1.2fr auto;
			gap: 15px;
			padding-inline: 15px;
		}
		.player-tools > input,
		.player-tools > :global(svg) {
			display: none;
		}
	}
	@media (max-width: 680px) {
		.drift {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 1fr 83px 58px;
			min-height: 400px;
		}
		.sidebar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 58px;
			z-index: 6;
			padding: 0;
			background: var(--background);
			border: 0;
			border-top: 1px solid var(--border);
		}
		.sidebar nav:first-of-type {
			display: flex;
			justify-content: space-around;
		}
		.sidebar nav:first-of-type a {
			display: grid;
			justify-items: center;
			gap: 4px;
			padding: 9px 5px;
			font-size: 8px;
		}
		.brand,
		.side-heading,
		.sidebar .collection-nav,
		.credits-link,
		.listener {
			display: none;
		}
		.topbar {
			height: 60px;
			padding: 12px 20px;
		}
		main {
			padding: 24px 18px 40px;
		}
		.player {
			grid-row: 2;
			grid-template-columns: 1fr auto;
			gap: 10px;
			padding: 10px 15px;
		}
		.playing img {
			width: 40px;
			height: 40px;
		}
		.playing .icon-button {
			display: none;
		}
		.transport {
			width: 154px;
			position: relative;
			padding-right: 26px;
		}
		.mobile-queue {
			display: grid !important;
			position: absolute;
			right: -5px;
			top: 3px;
		}
		.transport-buttons {
			gap: 6px;
		}
		.secondary-control,
		.player-tools {
			display: none;
		}
		.timeline {
			margin-top: 6px;
		}
		.timeline time {
			display: none;
		}
		.queue-panel {
			bottom: 141px;
			top: 60px;
		}
		.status {
			bottom: 150px;
		}
	}
</style>
