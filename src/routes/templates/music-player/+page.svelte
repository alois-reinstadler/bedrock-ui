<script lang="ts">
	import { Avatar, AvatarFallback } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import {
		collections,
		initialQueue,
		tracks,
		type Track
	} from '#lib/templates/music-player/data.js';
	import ClockIcon from '@lucide/svelte/icons/clock-3';
	import CompassIcon from '@lucide/svelte/icons/compass';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import HomeIcon from '@lucide/svelte/icons/house';
	import LibraryIcon from '@lucide/svelte/icons/library';
	import ListMusicIcon from '@lucide/svelte/icons/list-music';
	import PauseIcon from '@lucide/svelte/icons/pause';
	import PlayIcon from '@lucide/svelte/icons/play';
	import RepeatIcon from '@lucide/svelte/icons/repeat-2';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ShuffleIcon from '@lucide/svelte/icons/shuffle';
	import SkipBackIcon from '@lucide/svelte/icons/skip-back';
	import SkipForwardIcon from '@lucide/svelte/icons/skip-forward';
	import VolumeIcon from '@lucide/svelte/icons/volume-2';
	import VolumeOffIcon from '@lucide/svelte/icons/volume-x';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount, settled } from 'svelte';
	import { page } from '$app/state';
	import { pushState, replaceState } from '$app/navigation';

	type View = 'home' | 'search' | 'library' | 'favorites' | 'recent';
	let announcement = $state('Nine original instrumental sketches. Press play to listen.');
	let audio: HTMLAudioElement;
	let playbackError = $state('');
	let duration = $state(0);
	let savedAlbums = $state<string[]>(['after-dark', 'low-tide']);
	let recentlyPlayed = $state<string[]>([]);
	let nowPlayingOpen = $state(false);
	let returnFocus: HTMLElement | null = null;
	let playRequest = 0;

	let view = $state<View>('home');
	let query = $state('');
	let selectedCollectionId = $state(collections[0].id);
	let currentTrackId = $state(initialQueue[0]);
	let queue = $state([...initialQueue]);
	let isPlaying = $state(false);
	let elapsed = $state(0);
	let volume = $state(68);
	let previousVolume = $state(68);
	let queueOpen = $state(false);
	let favorites = $state<string[]>(['slow-current', 'paper-moon']);
	let shuffle = $state(false);
	let repeat = $state(false);

	const currentTrack = $derived(tracks.find((track) => track.id === currentTrackId) ?? tracks[0]);
	const selectedCollection = $derived(
		collections.find((collection) => collection.id === selectedCollectionId) ?? collections[0]
	);
	const collectionTracks = $derived(
		selectedCollection.trackIds
			.map((id) => tracks.find((track) => track.id === id))
			.filter((track): track is Track => Boolean(track))
	);
	const searchResults = $derived.by(() => {
		const term = query.trim().toLocaleLowerCase('en-US');
		if (!term) return tracks;
		return tracks.filter((track) =>
			[track.title, track.artist, track.album].some((value) =>
				value.toLocaleLowerCase('en-US').includes(term)
			)
		);
	});
	const visibleTracks = $derived(
		view === 'search'
			? searchResults
			: view === 'favorites'
				? tracks.filter((track) => favorites.includes(track.id))
				: view === 'recent'
					? recentlyPlayed
							.map((id) => tracks.find((track) => track.id === id))
							.filter((track): track is Track => Boolean(track))
					: collectionTracks
	);

	onMount(() => {
		restoreScreen();
		try {
			const saved = JSON.parse(localStorage.getItem('drift-library-v1') ?? 'null');
			if (saved) {
				if (Array.isArray(saved.favorites))
					favorites = saved.favorites.filter((id: string) =>
						tracks.some((track) => track.id === id)
					);
				if (Array.isArray(saved.albums))
					savedAlbums = saved.albums.filter((id: string) =>
						collections.some((collection) => collection.id === id)
					);
				if (Array.isArray(saved.recent))
					recentlyPlayed = saved.recent.filter((id: string) =>
						tracks.some((track) => track.id === id)
					);
			}
		} catch {
			announcement =
				'Your library is available for this visit; saved browser data could not be read.';
		}
	});

	function connectAudio(element: HTMLAudioElement) {
		audio = element;
		element.src = tracks[0].audio;
		element.volume = 0.68;
		return () => {
			playRequest += 1;
			element.pause();
			element.removeAttribute('src');
			element.load();
		};
	}

	function saveLibrary() {
		try {
			localStorage.setItem(
				'drift-library-v1',
				JSON.stringify({ favorites, albums: savedAlbums, recent: recentlyPlayed })
			);
		} catch {
			announcement = 'Your selection is saved for this visit only.';
		}
	}

	async function startPlayback() {
		const request = ++playRequest;
		playbackError = '';
		try {
			await audio.play();
		} catch (error) {
			if (request !== playRequest || (error instanceof DOMException && error.name === 'AbortError'))
				return;
			playbackError = 'Playback could not start. Check your connection and try again.';
			announcement = playbackError;
		}
	}

	function togglePlayback() {
		if (audio.paused) void startPlayback();
		else {
			playRequest += 1;
			audio.pause();
		}
	}

	function seek(value: number) {
		if (!Number.isFinite(audio.duration)) return;
		audio.currentTime = Math.max(0, Math.min(audio.duration, value));
		elapsed = audio.currentTime;
	}

	function setVolume(value: number) {
		volume = value;
		audio.volume = value / 100;
	}

	function trackEnded() {
		if (repeat) {
			seek(0);
			void startPlayback();
			return;
		}
		if (!shuffle && queue.indexOf(currentTrackId) === queue.length - 1) {
			announcement = 'You reached the end of your queue.';
			return;
		}
		nextTrack();
	}

	function toggleAlbum(id: string) {
		savedAlbums = savedAlbums.includes(id)
			? savedAlbums.filter((album) => album !== id)
			: [...savedAlbums, id];
		saveLibrary();
		announcement = savedAlbums.includes(id)
			? 'Album saved to your library.'
			: 'Album removed from your library.';
	}

	function updateLocation(
		nextView: View,
		album = selectedCollectionId,
		search = query,
		replace = false
	) {
		view = nextView;
		selectedCollectionId = album;
		query = search;
		const url = new URL(window.location.href);
		url.searchParams.set('view', nextView);
		url.searchParams.set('album', album);
		if (search) url.searchParams.set('q', search);
		else url.searchParams.delete('q');
		if (replace) replaceState(url, page.state);
		else pushState(url, page.state);
	}

	function restoreScreen() {
		const params = new URL(window.location.href).searchParams;
		const requested = params.get('view') ?? 'home';
		view = ['home', 'search', 'library', 'favorites', 'recent'].includes(requested)
			? (requested as View)
			: 'home';
		query = params.get('q') ?? '';
		selectedCollectionId = params.get('album') ?? collections[0].id;
	}

	function openCollection(id: string) {
		updateLocation('home', id);
	}

	async function openQueue() {
		returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		queueOpen = true;
		// Async rendering may still leave the panel hidden after tick().
		await settled();
		if (!queueOpen || !returnFocus?.isConnected) return;
		document
			.querySelector<HTMLButtonElement>('.queue-panel button[aria-label="Close play queue"]')
			?.focus({ preventScroll: true });
	}

	function closeQueue() {
		queueOpen = false;
		returnFocus?.focus();
	}

	function moveNext(id: string) {
		const remaining = queue.filter((track) => track !== id);
		const index = remaining.indexOf(currentTrackId);
		queue = [...remaining.slice(0, index + 1), id, ...remaining.slice(index + 1)];
		announcement = `${tracks.find((track) => track.id === id)?.title} will play next.`;
	}

	function artworkStyle(track: Pick<Track, 'tone' | 'accent'> & { id?: string }) {
		const artId =
			collections.find((collection) => collection.id === track.id)?.trackIds[0] ??
			track.id ??
			'soft-static';
		return `--art-tone:${track.tone};--art-accent:${track.accent};--cover-art:url('/templates/music-player/${artId}.svg')`;
	}

	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
	}

	function playTrack(id: string) {
		const track = tracks.find((item) => item.id === id);
		if (!track) return;
		playRequest += 1;
		currentTrackId = id;
		elapsed = 0;
		duration = 0;
		if (!queue.includes(id)) queue = [id, ...queue];
		if (audio.getAttribute('src') !== track.audio) {
			audio.src = track.audio;
			audio.load();
		} else seek(0);
		recentlyPlayed = [id, ...recentlyPlayed.filter((item) => item !== id)].slice(0, 9);
		saveLibrary();
		void startPlayback();
	}

	function nextTrack() {
		const alternatives = queue.filter((id) => id !== currentTrackId);
		if (!alternatives.length) {
			seek(0);
			void startPlayback();
			return;
		}
		const next = shuffle
			? alternatives[Math.floor(Math.random() * alternatives.length)]
			: queue[(queue.indexOf(currentTrackId) + 1) % queue.length];
		playTrack(next);
	}

	function previousTrack() {
		if (elapsed > 4) {
			seek(0);
			return;
		}
		playTrack(queue[(queue.indexOf(currentTrackId) - 1 + queue.length) % queue.length]);
	}

	function toggleFavorite(id: string) {
		favorites = favorites.includes(id)
			? favorites.filter((favorite) => favorite !== id)
			: [...favorites, id];
		saveLibrary();
		announcement = favorites.includes(id)
			? 'Song added to liked songs.'
			: 'Song removed from liked songs.';
	}

	function toggleMute() {
		if (volume > 0) {
			previousVolume = volume;
			setVolume(0);
		} else {
			setVolume(previousVolume || 68);
		}
	}

	function chooseView(nextView: View) {
		updateLocation(nextView);
		if (nextView === 'search')
			requestAnimationFrame(() =>
				document.querySelector<HTMLInputElement>('#music-search')?.focus()
			);
	}

	function handleKeydown(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			chooseView('search');
			return;
		}
		if (event.key === 'Escape') {
			if (queueOpen) closeQueue();
			nowPlayingOpen = false;
		}
		if (
			target.closest(
				'button, a, input, textarea, select, [role="slider"], [contenteditable="true"]'
			)
		)
			return;
		if (event.code === 'Space') {
			event.preventDefault();
			togglePlayback();
		}
		if (event.key === 'ArrowRight') seek(elapsed + 10);
		if (event.key === 'ArrowLeft') seek(elapsed - 10);
	}
</script>

<svelte:head>
	<title>Music Player — Bedrock Templates</title>
	<meta
		name="description"
		content="A responsive music streaming interface built entirely with Bedrock components."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onpopstate={restoreScreen} />
<audio
	{@attach connectAudio}
	preload="metadata"
	ontimeupdate={() => (elapsed = audio.currentTime)}
	ondurationchange={() => (duration = Number.isFinite(audio.duration) ? audio.duration : 0)}
	onplay={() => {
		isPlaying = true;
		announcement = `Playing ${currentTrack.title}.`;
		recentlyPlayed = [
			currentTrackId,
			...recentlyPlayed.filter((id) => id !== currentTrackId)
		].slice(0, 9);
		saveLibrary();
	}}
	onpause={() => (isPlaying = false)}
	onended={trackEnded}
	onerror={() => {
		isPlaying = false;
		playbackError = 'This song could not be loaded. Retry playback or choose another song.';
	}}
></audio>

<div class="music-shell" data-testid="music-player-template">
	<p class="sr-only" role="status">{announcement}</p>
	<a class="skip-link" href="#music-main">Skip to music</a>

	<header class="topbar">
		<div class="brand" aria-label="Drift music player">
			<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
			<strong>Drift</strong>
		</div>
		<div class="search-wrap">
			<Icon icon={SearchIcon} />
			<Input
				id="music-search"
				name="music-search"
				type="search"
				placeholder="Search songs, artists, albums"
				aria-label="Search music"
				value={query}
				oninput={(event) =>
					updateLocation('search', selectedCollectionId, event.currentTarget.value, true)}
				onfocus={() => {
					if (view !== 'search') updateLocation('search');
				}}
			/>
			<kbd>⌘ K</kbd>
		</div>
		<div class="account">
			<IconButton
				icon={ListMusicIcon}
				label="Open play queue"
				tooltip="Play queue"
				onclick={openQueue}
			/>
			<Avatar class="size-8">
				<AvatarFallback class="text-xs">RV</AvatarFallback>
			</Avatar>
		</div>
	</header>

	<aside class="sidebar" aria-label="Music navigation">
		<nav>
			<button class:active={view === 'home'} onclick={() => chooseView('home')}>
				<Icon icon={HomeIcon} /> Home
			</button>
			<button class:active={view === 'search'} onclick={() => chooseView('search')}>
				<Icon icon={CompassIcon} /> Discover
			</button>
			<button class:active={view === 'library'} onclick={() => chooseView('library')}>
				<Icon icon={LibraryIcon} /> Your library
			</button>
		</nav>

		<div class="sidebar-section">
			<p>Made for you</p>
			<button onclick={() => chooseView('recent')}><Icon icon={ClockIcon} /> Recently played</button
			>
			<button onclick={() => chooseView('favorites')}><Icon icon={HeartIcon} /> Liked songs</button>
		</div>

		<div class="sidebar-section collections-nav">
			<p>Collections</p>
			{#each collections as collection (collection.id)}
				<button
					class:active={selectedCollectionId === collection.id && view !== 'search'}
					onclick={() => {
						openCollection(collection.id);
					}}
				>
					<span class="nav-art" style={artworkStyle(collection)}></span>
					<span><strong>{collection.title}</strong><small>{collection.subtitle}</small></span>
				</button>
			{/each}
		</div>
	</aside>

	<main id="music-main" tabindex="-1">
		{#key `${view}-${selectedCollectionId}`}<div class="screen-enter">
				{#if view === 'search'}
					<section class="search-view" aria-labelledby="search-title">
						<p class="eyebrow">Discover</p>
						<h1 id="search-title">
							{query ? `Results for “${query}”` : 'Find your next favorite'}
						</h1>
						<p class="lede">
							{query
								? `${searchResults.length} ${searchResults.length === 1 ? 'track' : 'tracks'} found across your library.`
								: 'Search the local catalogue by song, artist, or album.'}
						</p>
					</section>
				{:else if view === 'favorites'}
					<section class="search-view">
						<p class="eyebrow">Your collection</p>
						<h1>Liked songs</h1>
						<p class="lede">Your favorites, together in one place.</p>
					</section>
				{:else if view === 'recent'}<section class="search-view">
						<p class="eyebrow">Listening history</p>
						<h1>Recently played</h1>
						<p class="lede">The songs you started most recently, saved on this browser.</p>
					</section>
				{:else if view === 'library'}
					<section class="search-view" aria-labelledby="library-title">
						<p class="eyebrow">Your collection</p>
						<h1 id="library-title">Saved for later</h1>
						<p class="lede">{savedAlbums.length} saved albums · {favorites.length} liked songs</p>
						<Button variant="outline" onclick={() => chooseView('favorites')}
							>Open liked songs</Button
						>{#if savedAlbums.length === 0}<p class="lede">
								No albums saved yet. Explore the records below and choose Save album.
							</p>{/if}
					</section>
					<div class="album-grid">
						{#each collections.filter( (collection) => savedAlbums.includes(collection.id) ) as collection (collection.id)}
							<button
								class="album-card"
								onclick={() => {
									openCollection(collection.id);
								}}
							>
								<span class="album-art" style={artworkStyle(collection)}><i></i></span>
								<strong>{collection.title}</strong>
								<small>{collection.subtitle}</small>
							</button>
						{/each}
					</div>
				{:else}
					<section
						class="hero"
						style={artworkStyle(selectedCollection)}
						aria-labelledby="collection-title"
					>
						<div class="hero-copy">
							<Badge variant="secondary">Album pick</Badge>
							<p class="eyebrow">
								Original instrumental collection · {collectionTracks.length} tracks
							</p>
							<h1 id="collection-title">{selectedCollection.title}</h1>
							<p>{selectedCollection.description}</p>
							<p class="collection-meta">
								{selectedCollection.subtitle} · {formatTime(
									collectionTracks.reduce((total, track) => total + track.duration, 0)
								)} total · Original audio sketches
							</p>
							<div class="hero-actions">
								<Button
									size="lg"
									onclick={() => {
										queue = [...selectedCollection.trackIds];
										playTrack(queue[0]);
									}}
								>
									<Icon icon={PlayIcon} /> Play album
								</Button>
								<Button
									size="lg"
									variant="secondary"
									aria-pressed={savedAlbums.includes(selectedCollection.id)}
									onclick={() => toggleAlbum(selectedCollection.id)}
								>
									<Icon
										icon={HeartIcon}
										class={savedAlbums.includes(selectedCollection.id) ? 'filled' : ''}
									/>
									{savedAlbums.includes(selectedCollection.id) ? 'Saved' : 'Save album'}
								</Button>
							</div>
						</div>
						<div class="hero-art" aria-hidden="true"><i></i><i></i><i></i></div>
					</section>
				{/if}

				{#if view !== 'library'}
					<section class="track-section" aria-labelledby="track-title">
						<div class="section-heading">
							<div>
								<p class="eyebrow">{view === 'search' ? 'Songs' : 'From this record'}</p>
								<h2 id="track-title">{view === 'search' ? 'Search results' : 'Track list'}</h2>
							</div>
							<span>{visibleTracks.length} songs</span>
						</div>

						<div class="track-list" role="list">
							{#each visibleTracks as track, index (track.id)}
								<div class:current={track.id === currentTrackId} class="track-row" role="listitem">
									<button
										class="track-play"
										aria-label={`${track.id === currentTrackId && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
										onclick={() =>
											track.id === currentTrackId ? togglePlayback() : playTrack(track.id)}
									>
										<span>{index + 1}</span>
										<Icon icon={track.id === currentTrackId && isPlaying ? PauseIcon : PlayIcon} />
									</button>
									<span class="track-art" style={artworkStyle(track)}></span>
									<button
										class="track-name"
										aria-label={`Listen to ${track.title}`}
										onclick={() => playTrack(track.id)}
										><strong>{track.title}</strong><small>{track.artist}</small></button
									>
									<span class="track-album">{track.album}</span>
									<IconButton
										icon={HeartIcon}
										label={`${favorites.includes(track.id) ? 'Remove' : 'Add'} ${track.title} ${favorites.includes(track.id) ? 'from' : 'to'} favorites`}
										class={favorites.includes(track.id) ? 'favorite' : ''}
										onclick={() => toggleFavorite(track.id)}
									/>
									<time datetime={`PT${track.duration}S`}>{formatTime(track.duration)}</time>
									<IconButton
										icon={ListMusicIcon}
										label={`Queue ${track.title}`}
										onclick={() => {
											if (!queue.includes(track.id)) queue = [...queue, track.id];
											announcement = `${track.title} is in your queue.`;
										}}
									/>
								</div>
							{:else}
								<div class="empty-search">
									<Icon icon={SearchIcon} />
									<h2>
										{view === 'favorites'
											? 'No liked songs yet'
											: view === 'recent'
												? 'Your listening starts here'
												: 'No songs found'}
									</h2>
									<p>
										{view === 'search'
											? 'Try another title, artist, or album.'
											: 'Play or save a song from a record to build your collection.'}
									</p>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<section class="recent-section" aria-labelledby="recent-title">
					<div class="section-heading">
						<h2 id="recent-title">Keep listening</h2>
						<Button variant="ghost" onclick={() => chooseView('library')}>See all</Button>
					</div>
					<div class="album-grid compact">
						{#each collections as collection (collection.id)}
							<button
								class="album-card"
								onclick={() => {
									openCollection(collection.id);
								}}
							>
								<span class="album-art" style={artworkStyle(collection)}><i></i></span>
								<strong>{collection.title}</strong>
								<small>{collection.subtitle}</small>
							</button>
						{/each}
					</div>
				</section>
			</div>{/key}
	</main>

	<aside class:open={queueOpen} class="queue-panel" aria-label="Play queue">
		<div class="queue-heading">
			<div>
				<p class="eyebrow">Up next</p>
				<h2>Play queue</h2>
			</div>
			<IconButton icon={XIcon} label="Close play queue" onclick={closeQueue} />
		</div>
		<ScrollArea class="queue-scroll" edgeBlur="vertical">
			<div class="queue-now">
				<span class="queue-art" style={artworkStyle(currentTrack)}><i></i></span>
				<p>Original instrumental · {isPlaying ? 'Playing' : 'Paused'}</p>
				<h3>{currentTrack.title}</h3>
				<span>{currentTrack.artist}</span>
			</div>
			<div class="queue-list">
				{#each shuffle ? queue.filter((id) => id !== currentTrackId) : queue.slice(queue.indexOf(currentTrackId) + 1) as id, index (id)}
					{@const track = tracks.find((item) => item.id === id)}
					{#if track}
						<div class="queue-entry">
							<button onclick={() => playTrack(track.id)}>
								<span class="queue-index">{String(index + 1).padStart(2, '0')}</span>
								<span class="track-art" style={artworkStyle(track)}></span>
								<span><strong>{track.title}</strong><small>{track.artist}</small></span>
								<Icon icon={PlayIcon} />
							</button>
							<div class="queue-entry-actions">
								<Button size="sm" variant="ghost" onclick={() => moveNext(id)}>Play next</Button
								><IconButton
									icon={XIcon}
									label={`Remove ${track.title} from queue`}
									onclick={() => {
										queue = queue.filter((item) => item !== id);
										announcement = `${track.title} removed from queue.`;
									}}
								/>
							</div>
						</div>
					{/if}
				{:else}<p class="p-4 text-sm text-muted-foreground">
						No more songs queued. Add songs from the track list.
					</p>{/each}
			</div>
		</ScrollArea>
	</aside>

	<nav class="mobile-nav" aria-label="Mobile music navigation">
		<button class:active={view === 'home'} onclick={() => chooseView('home')}
			><Icon icon={HomeIcon} /><span>Home</span></button
		>
		<button class:active={view === 'search'} onclick={() => chooseView('search')}
			><Icon icon={SearchIcon} /><span>Search</span></button
		>
		<button class:active={view === 'library'} onclick={() => chooseView('library')}
			><Icon icon={LibraryIcon} /><span>Library</span></button
		>
		<button onclick={openQueue}><Icon icon={ListMusicIcon} /><span>Queue</span></button>
	</nav>

	{#if playbackError}<div class="playback-error" role="alert">
			<span>{playbackError}</span><Button
				size="sm"
				variant="outline"
				onclick={() => {
					audio.load();
					void startPlayback();
				}}>Retry playback</Button
			>
		</div>{/if}
	<footer class:expanded={nowPlayingOpen} class="player" aria-label="Music player controls">
		<div class="playing-track">
			<span class="player-art" style={artworkStyle(currentTrack)}></span>
			<button
				class="now-playing-toggle"
				aria-expanded={nowPlayingOpen}
				onclick={() => (nowPlayingOpen = !nowPlayingOpen)}
				><strong>{currentTrack.title}</strong><small
					>{currentTrack.artist} · {nowPlayingOpen ? 'Collapse player' : 'Now playing'}</small
				></button
			>
			<IconButton
				icon={HeartIcon}
				label={`${favorites.includes(currentTrack.id) ? 'Remove' : 'Add'} current song ${favorites.includes(currentTrack.id) ? 'from' : 'to'} favorites`}
				class={favorites.includes(currentTrack.id) ? 'favorite' : ''}
				onclick={() => toggleFavorite(currentTrack.id)}
			/>
		</div>
		{#if nowPlayingOpen}<div class="now-playing-detail">
				<span class="detail-art" style={artworkStyle(currentTrack)}></span>
				<div>
					<p class="eyebrow">Now playing</p>
					<h2>{currentTrack.title}</h2>
					<p>{currentTrack.album}</p>
					<p class="text-sm text-muted-foreground">
						Original instrumental sketch · {formatTime(currentTrack.duration)} · Synth keys, bass, chords,
						and percussion.
					</p>
					<Button variant="outline" size="sm" onclick={() => (nowPlayingOpen = false)}
						>Collapse player</Button
					>
				</div>
			</div>{/if}
		<div class="transport">
			<div class="transport-buttons">
				<IconButton
					icon={ShuffleIcon}
					label="Toggle shuffle"
					aria-pressed={shuffle}
					class={shuffle ? 'enabled' : ''}
					onclick={() => (shuffle = !shuffle)}
				/>
				<IconButton icon={SkipBackIcon} label="Previous song" onclick={previousTrack} />
				<IconButton
					icon={isPlaying ? PauseIcon : PlayIcon}
					label={isPlaying ? 'Pause' : 'Play'}
					class="main-play"
					variant="default"
					onclick={() => togglePlayback()}
				/>
				<IconButton icon={SkipForwardIcon} label="Next song" onclick={nextTrack} />
				<IconButton
					icon={RepeatIcon}
					label="Toggle repeat"
					aria-pressed={repeat}
					class={repeat ? 'enabled' : ''}
					onclick={() => (repeat = !repeat)}
				/>
			</div>
			<div class="timeline">
				<time>{formatTime(elapsed)}</time>
				<input
					type="range"
					min={0}
					max={duration || currentTrack.duration}
					value={elapsed}
					oninput={(event) => seek(Number(event.currentTarget.value))}
					aria-label="Song position"
				/>
				<time>{formatTime(duration || currentTrack.duration)}</time>
			</div>
		</div>
		<div class="player-tools">
			<IconButton icon={ListMusicIcon} label="Open queue" onclick={openQueue} />
			<IconButton
				icon={volume === 0 ? VolumeOffIcon : VolumeIcon}
				label={volume === 0 ? 'Unmute' : 'Mute'}
				onclick={toggleMute}
			/>
			<input
				type="range"
				min={0}
				max={100}
				value={volume}
				oninput={(event) => setVolume(Number(event.currentTarget.value))}
				aria-label="Volume"
			/>
		</div>
	</footer>
</div>

<style>
	.screen-enter {
		animation: music-screen var(--motion-enter) var(--motion-ease-enter) both;
	}
	@keyframes music-screen {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.collection-meta {
		font-size: 0.75rem !important;
		line-height: 1.6;
	}
	.playback-error {
		position: fixed;
		bottom: 8rem;
		left: 1rem;
		right: 1rem;
		z-index: 80;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--destructive);
		border-radius: 0.75rem;
		background: var(--card);
	}
	.now-playing-toggle {
		display: grid;
		min-width: 0;
		text-align: left;
	}
	.now-playing-detail {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem;
	}
	.now-playing-detail h2 {
		font-size: 1.8rem;
		font-weight: 650;
	}
	.now-playing-detail p {
		margin: 0.4rem 0;
	}
	.detail-art {
		flex-shrink: 0;
		width: 8rem;
		aspect-ratio: 1;
		border-radius: 1rem;
		background:
			radial-gradient(circle at 50% 50%, transparent 30%, var(--art-accent) 31%, transparent 32%),
			conic-gradient(from 50deg, var(--art-tone), var(--art-accent), var(--art-tone));
	}
	.player.expanded {
		position: fixed;
		z-index: 70;
		bottom: 0;
		left: 0;
		right: 0;
		height: auto;
		grid-template-rows: auto auto;
		border-radius: 1.5rem 1.5rem 0 0;
		box-shadow: 0 -2rem 5rem #0002;
	}
	.player.expanded .now-playing-detail {
		grid-row: 1;
	}
	@media (max-width: 640px) {
		.now-playing-detail {
			gap: 0.8rem;
			padding: 0.4rem;
		}
		.detail-art {
			width: 5rem;
		}
		.now-playing-detail h2 {
			font-size: 1.3rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.screen-enter {
			animation: none;
		}
	}

	.music-shell {
		--music-panel: color-mix(in oklab, var(--card) 88%, transparent);
		--music-subtle: color-mix(in oklab, var(--foreground) 5%, transparent);
		display: grid;
		grid-template: 4.25rem minmax(0, 1fr) 6.5rem / 15rem minmax(0, 1fr) 19rem;
		height: max(42rem, calc(100svh - 7rem));
		background:
			radial-gradient(
				circle at 42% -20%,
				color-mix(in oklab, #d67189 12%, transparent),
				transparent 34rem
			),
			var(--background);
		color: var(--foreground);
	}

	.skip-link {
		position: fixed;
		z-index: 100;
		left: 1rem;
		top: 0.5rem;
		translate: 0 -150%;
		border-radius: 0.5rem;
		background: var(--primary);
		color: var(--primary-foreground);
		padding: 0.6rem 0.9rem;
	}

	.skip-link:focus {
		translate: 0;
	}

	.topbar {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 15rem minmax(18rem, 32rem) 1fr;
		align-items: center;
		gap: 1.5rem;
		border-bottom: 1px solid var(--border);
		padding: 0 1rem;
		background: color-mix(in oklab, var(--background) 82%, transparent);
		backdrop-filter: blur(24px);
		z-index: 20;
	}

	.brand,
	.account,
	.playing-track,
	.timeline,
	.transport-buttons,
	.player-tools {
		display: flex;
		align-items: center;
	}

	.brand {
		position: relative;
		gap: 0.6rem;
	}
	.brand-mark {
		display: flex;
		align-items: end;
		gap: 2px;
		height: 1.1rem;
	}
	.brand-mark i {
		display: block;
		width: 3px;
		border-radius: 999px;
		background: #d36680;
	}
	.brand-mark i:nth-child(1) {
		height: 55%;
	}
	.brand-mark i:nth-child(2) {
		height: 100%;
	}
	.brand-mark i:nth-child(3) {
		height: 72%;
	}

	.search-wrap {
		position: relative;
		grid-column: 2;
	}
	.search-wrap > :global(svg) {
		position: absolute;
		z-index: 1;
		left: 0.85rem;
		top: 50%;
		translate: 0 -50%;
		color: var(--muted-foreground);
	}
	.search-wrap :global(input) {
		height: 2.7rem;
		border-radius: 999px;
		padding-left: 2.5rem;
		padding-right: 3.5rem;
		background: var(--music-subtle);
		border-color: transparent;
	}
	.search-wrap kbd {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		translate: 0 -50%;
		border: 1px solid var(--border);
		border-radius: 0.3rem;
		padding: 0.1rem 0.35rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.account {
		justify-self: end;
		gap: 0.5rem;
	}

	.sidebar {
		grid-column: 1;
		grid-row: 2;
		overflow: auto;
		border-right: 1px solid var(--border);
		padding: 1.25rem 0.75rem;
	}
	.sidebar nav,
	.sidebar-section {
		display: grid;
		gap: 0.25rem;
	}
	.sidebar nav button,
	.sidebar-section > button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		min-height: 2.5rem;
		border-radius: 0.65rem;
		padding: 0.5rem 0.7rem;
		color: var(--muted-foreground);
		text-align: left;
		font-size: 0.875rem;
	}
	.sidebar button:hover,
	.sidebar button.active {
		background: var(--music-subtle);
		color: var(--foreground);
	}
	.sidebar-section {
		margin-top: 1.6rem;
	}
	.sidebar-section > p {
		padding: 0 0.7rem 0.35rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 650;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.collections-nav button {
		align-items: center;
	}
	.collections-nav button > span:last-child {
		display: grid;
		min-width: 0;
	}
	.collections-nav strong,
	.collections-nav small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.collections-nav strong {
		color: var(--foreground);
		font-size: 0.78rem;
		font-weight: 600;
	}
	.collections-nav small {
		font-size: 0.68rem;
	}
	.nav-art,
	.track-art,
	.player-art {
		flex: 0 0 auto;
		background: linear-gradient(145deg, var(--art-accent), var(--art-tone));
	}
	.nav-art {
		width: 2rem;
		height: 2rem;
		border-radius: 0.35rem;
	}

	main {
		grid-column: 2;
		grid-row: 2;
		overflow-y: auto;
		scroll-behavior: smooth;
		padding: 1.5rem clamp(1.25rem, 3vw, 3rem) 3rem;
	}
	.hero {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 28%);
		min-height: 21rem;
		overflow: hidden;
		border: 1px solid color-mix(in oklab, var(--art-accent) 25%, var(--border));
		border-radius: 1.4rem;
		padding: clamp(1.5rem, 4vw, 3rem);
		background: linear-gradient(
			120deg,
			color-mix(in oklab, var(--art-tone) 35%, var(--card)),
			color-mix(in oklab, var(--art-tone) 12%, var(--background))
		);
		box-shadow: 0 2rem 5rem -3rem color-mix(in oklab, var(--art-tone) 60%, transparent);
	}
	.hero::after {
		content: '';
		position: absolute;
		z-index: -1;
		width: 26rem;
		aspect-ratio: 1;
		right: -8rem;
		top: -10rem;
		border-radius: 50%;
		background: var(--art-accent);
		opacity: 0.16;
		filter: blur(50px);
	}
	.hero-copy {
		align-self: end;
		max-width: 40rem;
	}
	.eyebrow {
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}
	.hero h1,
	.search-view h1 {
		margin-top: 0.6rem;
		font-size: clamp(2.5rem, 5vw, 5rem);
		font-weight: 650;
		line-height: 0.94;
		letter-spacing: -0.055em;
	}
	.hero-copy > p:last-of-type {
		margin-top: 1rem;
		max-width: 34rem;
		color: color-mix(in oklab, var(--foreground) 72%, transparent);
		font-size: 1rem;
	}
	.hero-actions {
		display: flex;
		gap: 0.65rem;
		margin-top: 1.5rem;
	}
	.hero-art {
		position: relative;
		align-self: center;
		justify-self: end;
		width: min(17rem, 100%);
		aspect-ratio: 1;
		border-radius: 1.2rem;
		background: conic-gradient(
			from 110deg,
			var(--art-tone),
			var(--art-accent),
			color-mix(in oklab, var(--art-tone) 80%, black),
			var(--art-tone)
		);
		box-shadow: 0 1.5rem 4rem -1.2rem color-mix(in oklab, var(--art-tone) 75%, transparent);
		rotate: 4deg;
	}
	.hero-art i {
		position: absolute;
		inset: 18%;
		border: 1px solid color-mix(in oklab, white 35%, transparent);
		border-radius: 50%;
	}
	.hero-art i:nth-child(2) {
		inset: 31%;
	}
	.hero-art i:nth-child(3) {
		inset: 45%;
		background: color-mix(in oklab, var(--art-accent) 55%, white);
	}

	.track-section,
	.recent-section {
		margin-top: 2.5rem;
	}
	.section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 0.9rem;
	}
	.section-heading h2 {
		margin-top: 0.2rem;
		font-size: 1.35rem;
		font-weight: 650;
		letter-spacing: -0.025em;
	}
	.section-heading > span {
		color: var(--muted-foreground);
		font-size: 0.78rem;
	}
	.track-list {
		display: grid;
	}
	.track-row {
		display: grid;
		grid-template-columns: 2rem 2.7rem minmax(9rem, 1.2fr) minmax(8rem, 1fr) 2.5rem 3rem 2.5rem;
		align-items: center;
		gap: 0.7rem;
		min-height: 3.9rem;
		border-radius: 0.7rem;
		padding: 0.35rem 0.55rem;
		font-size: 0.8rem;
	}
	.track-row:hover,
	.track-row.current {
		background: var(--music-subtle);
	}
	.track-play {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		color: var(--muted-foreground);
	}
	.track-play :global(svg) {
		display: none;
	}
	.track-row:hover .track-play span,
	.track-row.current .track-play span {
		display: none;
	}
	.track-row:hover .track-play :global(svg),
	.track-row.current .track-play :global(svg) {
		display: block;
	}
	.track-art,
	.player-art {
		width: 2.55rem;
		height: 2.55rem;
		border-radius: 0.45rem;
	}
	.track-name {
		display: grid;
		min-width: 0;
	}
	.track-name strong,
	.track-name small,
	.track-album {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.track-name small,
	.track-album,
	.track-row time {
		color: var(--muted-foreground);
	}
	:global(button.favorite svg),
	:global(svg.filled) {
		fill: currentColor;
		color: #d85e7b;
	}
	:global(button.enabled) {
		color: #d85e7b !important;
	}
	.empty-search {
		display: grid;
		place-items: center;
		min-height: 13rem;
		border: 1px dashed var(--border);
		border-radius: 1rem;
		text-align: center;
	}
	.empty-search :global(svg) {
		width: 2rem;
		height: 2rem;
		color: var(--muted-foreground);
	}
	.empty-search h2 {
		margin-top: 0.75rem;
		font-weight: 650;
	}
	.empty-search p {
		color: var(--muted-foreground);
		font-size: 0.85rem;
	}

	.search-view {
		padding: 2rem 0 1rem;
	}
	.search-view .lede {
		margin-top: 0.8rem;
		color: var(--muted-foreground);
	}
	.album-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(8rem, 1fr));
		gap: 1rem;
	}
	.album-card {
		display: grid;
		min-width: 0;
		border-radius: 0.9rem;
		padding: 0.75rem;
		text-align: left;
		transition:
			background-color var(--motion-state) var(--motion-ease-enter),
			transform var(--motion-state) var(--motion-ease-enter);
	}
	.album-card:hover {
		background: var(--music-subtle);
		transform: translateY(-2px);
	}
	.album-art {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 0.7rem;
		background:
			radial-gradient(
				circle at 68% 26%,
				color-mix(in oklab, var(--art-accent) 92%, white),
				transparent 25%
			),
			linear-gradient(145deg, var(--art-accent), var(--art-tone));
		box-shadow: 0 1rem 2rem -1rem color-mix(in oklab, var(--art-tone) 60%, transparent);
	}
	.album-art::before,
	.album-art::after {
		content: '';
		position: absolute;
		border: 1px solid color-mix(in oklab, white 35%, transparent);
		border-radius: 50%;
		inset: 18%;
	}
	.album-art::after {
		inset: 34%;
	}
	.album-art i {
		position: absolute;
		inset: 44%;
		border-radius: 50%;
		background: color-mix(in oklab, var(--art-tone) 75%, black);
	}
	.album-card strong {
		margin-top: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.86rem;
	}
	.album-card small {
		color: var(--muted-foreground);
		font-size: 0.73rem;
	}

	.queue-panel {
		grid-column: 3;
		grid-row: 2;
		min-width: 0;
		border-left: 1px solid var(--border);
		background: var(--music-panel);
		padding: 1.25rem 0.8rem 0;
	}
	.queue-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.45rem 1rem;
	}
	.queue-heading h2 {
		font-size: 1.1rem;
		font-weight: 650;
	}
	.queue-heading > :global(button) {
		display: none;
	}
	:global(.queue-scroll) {
		height: calc(100% - 4rem);
	}
	.queue-now {
		text-align: center;
		padding: 0.5rem 1rem 1.8rem;
	}
	.queue-art {
		position: relative;
		display: block;
		width: min(12rem, 78%);
		aspect-ratio: 1;
		margin: 0 auto 1.2rem;
		border-radius: 50%;
		background:
			repeating-radial-gradient(
				circle,
				transparent 0 9%,
				color-mix(in oklab, white 10%, transparent) 9.5% 10%
			),
			radial-gradient(circle at center, var(--art-accent) 0 10%, var(--art-tone) 10% 100%);
		box-shadow: 0 1.2rem 3rem -1rem color-mix(in oklab, var(--art-tone) 70%, transparent);
	}
	.queue-art i {
		position: absolute;
		inset: 45%;
		border-radius: 50%;
		background: var(--background);
	}
	.queue-now p {
		margin-bottom: 0.35rem;
		color: var(--muted-foreground);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.queue-now h3 {
		font-size: 1.05rem;
		font-weight: 650;
	}
	.queue-now > span:last-child {
		color: var(--muted-foreground);
		font-size: 0.8rem;
	}
	.queue-list {
		display: grid;
		gap: 0.2rem;
		padding-bottom: 2rem;
	}
	.queue-list button {
		display: grid;
		grid-template-columns: 1.5rem 2.3rem minmax(0, 1fr) 1rem;
		align-items: center;
		gap: 0.6rem;
		border-radius: 0.65rem;
		padding: 0.45rem;
		text-align: left;
	}
	.queue-list button:hover {
		background: var(--music-subtle);
	}
	.queue-list button > span:nth-child(3) {
		display: grid;
		min-width: 0;
	}
	.queue-list strong,
	.queue-list small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.queue-list strong {
		font-size: 0.78rem;
	}
	.queue-list small,
	.queue-index {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.queue-list button > :global(svg) {
		opacity: 0;
	}
	.queue-list button:hover > :global(svg) {
		opacity: 1;
	}

	.player {
		grid-column: 1 / -1;
		grid-row: 3;
		z-index: 30;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(15rem, 1.5fr) minmax(0, 1fr);
		align-items: center;
		gap: 1.5rem;
		border-top: 1px solid var(--border);
		padding: 0.7rem 1rem;
		background: color-mix(in oklab, var(--background) 92%, transparent);
		backdrop-filter: blur(28px);
	}
	.playing-track {
		min-width: 0;
		gap: 0.7rem;
	}
	.playing-track > .now-playing-toggle {
		display: grid;
		min-width: 0;
	}
	.playing-track strong,
	.playing-track small {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.playing-track strong {
		font-size: 0.8rem;
	}
	.playing-track small {
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.transport {
		display: grid;
		gap: 0.35rem;
	}
	.transport-buttons {
		justify-content: center;
		gap: 0.25rem;
	}
	.transport-buttons :global(.main-play) {
		margin: 0 0.35rem;
		border-radius: 999px;
	}
	.timeline {
		gap: 0.7rem;
	}
	.timeline input,
	.player-tools input {
		flex: 1;
	}
	.timeline time {
		width: 2.5rem;
		color: var(--muted-foreground);
		font-variant-numeric: tabular-nums;
		font-size: 0.65rem;
	}
	.timeline time:last-child {
		text-align: right;
	}
	.player-tools {
		justify-content: end;
		gap: 0.25rem;
	}
	.player-tools input {
		max-width: 6rem;
	}
	.mobile-nav {
		display: none;
	}

	input[type='range'] {
		min-width: 0;
		accent-color: var(--primary);
	}
	.track-name {
		text-align: left;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	@media (max-width: 1180px) {
		.music-shell {
			grid-template-columns: 13.5rem minmax(0, 1fr);
		}
		.topbar {
			grid-template-columns: 13.5rem minmax(16rem, 28rem) 1fr;
		}
		.queue-panel {
			position: fixed;
			z-index: 50;
			top: 4.25rem;
			right: 0;
			bottom: 6.5rem;
			width: min(21rem, 88vw);
			translate: 105% 0;
			visibility: hidden;
			transition: translate var(--motion-overlay) var(--motion-ease-drawer);
			box-shadow: -2rem 0 5rem -3rem black;
		}
		.queue-panel.open {
			visibility: visible;
			translate: 0;
		}
		.queue-heading > :global(button) {
			display: inline-flex;
		}
		main {
			grid-column: 2;
		}
	}

	@media (max-width: 760px) {
		.music-shell {
			display: block;
			height: auto;
			min-height: 100svh;
			padding-bottom: 10.4rem;
			background: var(--background);
		}
		.topbar {
			position: relative;
			top: 0;
			display: grid;
			grid-template-columns: 0 minmax(0, 1fr) auto;
			height: 3.8rem;
			gap: 0.6rem;
			padding: 0 0.75rem;
		}
		.brand,
		.search-wrap kbd,
		.account > :global(button) {
			display: none;
		}
		.search-wrap {
			grid-column: 2;
		}
		.search-wrap :global(input) {
			height: 2.35rem;
		}
		.sidebar {
			display: none;
		}
		main {
			overflow: visible;
			padding: 0.75rem 0.75rem 3rem;
		}
		.hero {
			grid-template-columns: 1fr;
			min-height: 24rem;
			border-radius: 1rem;
			padding: 1.25rem;
		}
		.hero-copy {
			z-index: 2;
			align-self: end;
		}
		.hero h1 {
			max-width: 85%;
			font-size: 2.7rem;
		}
		.hero-art {
			position: absolute;
			right: -2rem;
			top: -2rem;
			width: 15rem;
			opacity: 0.7;
		}
		.track-section,
		.recent-section {
			margin-top: 1.8rem;
		}
		.track-row {
			grid-template-columns: 2.6rem minmax(0, 1fr) 2.5rem 2.5rem;
			gap: 0.55rem;
			min-height: 3.8rem;
		}
		.track-play,
		.track-album,
		.track-row time,
		.track-row > :global(button:last-child) {
			display: none;
		}
		.album-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.45rem;
		}
		.album-card {
			padding: 0.45rem;
		}
		.compact .album-card:nth-child(n + 3) {
			display: none;
		}
		.queue-panel {
			/* Keep the close control below the shared sticky site header. */
			top: calc(3.5rem + 1px);
			bottom: 10.4rem;
			width: min(22rem, 100vw);
			padding-top: 1rem;
		}
		.player {
			position: fixed;
			z-index: 40;
			left: 0.5rem;
			right: 0.5rem;
			bottom: 3.75rem;
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			min-height: 6rem;
			gap: 0.4rem;
			border: 1px solid var(--border);
			border-radius: 0.85rem;
			padding: 0.45rem;
			box-shadow: 0 1rem 3rem -1rem rgb(0 0 0 / 35%);
		}
		.playing-track > :global(button:not(.now-playing-toggle)) {
			display: none;
		}
		.transport {
			display: block;
		}
		.transport-buttons > :global(button:not(.main-play)) {
			display: none;
		}
		.transport-buttons :global(.main-play) {
			margin: 0;
		}
		.timeline {
			display: none;
		}
		.player-tools {
			grid-column: 1 / -1;
			justify-content: center;
		}
		.mobile-nav {
			position: fixed;
			z-index: 35;
			left: 0;
			right: 0;
			bottom: 0;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			height: 4.25rem;
			border-top: 1px solid var(--border);
			background: color-mix(in oklab, var(--background) 94%, transparent);
			backdrop-filter: blur(24px);
		}
		.mobile-nav button {
			display: grid;
			place-items: center;
			align-content: center;
			gap: 0.2rem;
			color: var(--muted-foreground);
			font-size: 0.62rem;
		}
		.mobile-nav button.active {
			color: var(--foreground);
		}
		.mobile-nav :global(svg) {
			width: 1.15rem;
			height: 1.15rem;
		}
		.search-view {
			padding: 1.25rem 0 0.5rem;
		}
		.search-view h1 {
			font-size: 2.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			scroll-behavior: auto !important;
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}
		.album-card:hover {
			transform: none;
		}
	}

	.nav-art,
	.track-art,
	.player-art,
	.album-art,
	.hero-art,
	.detail-art {
		background-image: var(--cover-art);
		background-size: cover;
		background-position: center;
	}
	.queue-entry {
		border-bottom: 1px solid var(--border);
	}
	.queue-entry > button {
		width: 100%;
	}
	.queue-entry-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.queue-entry-actions :global(button) {
		display: inline-flex;
	}
	.player.expanded {
		max-height: 80svh;
		overflow-y: auto;
	}
	.player.expanded .timeline {
		display: flex;
	}
	.player.expanded .transport-buttons > :global(button) {
		display: inline-flex;
	}
	@media (max-width: 760px) {
		.player.expanded .transport {
			grid-column: 1 / -1;
		}
		.player.expanded .playing-track {
			grid-column: 1 / -1;
		}
		.player.expanded .now-playing-detail {
			grid-column: 1 / -1;
		}
	}

	@media (min-width: 761px) and (max-width: 1300px) {
		.track-row {
			grid-template-columns: 1.75rem 2.4rem minmax(0, 1fr) 2rem 2.5rem 2rem;
			gap: 0.5rem;
		}
		.track-album {
			display: none;
		}
		.hero {
			grid-template-columns: minmax(0, 1fr) minmax(7rem, 36%);
			gap: 1rem;
		}
	}
	@media (min-width: 761px) and (max-width: 1100px) {
		.album-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
