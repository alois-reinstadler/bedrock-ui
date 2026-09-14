<script lang="ts">
	import * as Avatar from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Text } from '#lib/bedrock/ui/text';
	import { VideoPlayer } from '#lib/bedrock/ui/video-player';
	import { onMount, tick, untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		catalogue,
		featured,
		findVideo,
		rails,
		categories,
		shortFilms,
		filmFor,
		type VideoItem
	} from './catalog.js';
	import PosterArt from './PosterArt.svelte';
	import VideoCard from './VideoCard.svelte';

	type DialogMode = 'details' | 'player';
	type View = 'discover' | 'watchlist';

	let ready = $state(false);
	onMount(() => {
		try {
			const stored = JSON.parse(localStorage.getItem('bedrock-frame-library-v1') ?? '{}');
			if (Array.isArray(stored.watchlist)) {
				watchlist.clear();
				for (const id of stored.watchlist)
					if (catalogue.some((item) => item.id === id)) watchlist.add(id);
			}
			if (stored.progress && typeof stored.progress === 'object') {
				for (const [id, seconds] of Object.entries(stored.progress))
					if (
						catalogue.some((item) => item.id === id) &&
						typeof seconds === 'number' &&
						Number.isFinite(seconds) &&
						seconds >= 0 &&
						seconds < 24
					)
						progress[id] = seconds;
			}
		} catch {
			storageAvailable = false;
		}
		ready = true;
	});
	let query = $state('');
	let category = $state('All titles');
	let progress = $state<Record<string, number>>({});
	let storageAvailable = $state(true);
	let playbackError = $state(false);
	let playbackAttempt = $state(0);
	let flushPlayback: () => void = () => {};
	const categoryItems = $derived(
		catalogue.filter(
			(item) =>
				category === 'All titles' ||
				(category === 'Original shorts' ? item.id in shortFilms : item.genres.includes(category))
		)
	);
	const continueItems = $derived(catalogue.filter((item) => (progress[item.id] ?? 0) >= 1));
	const related = $derived(
		catalogue
			.filter(
				(item) =>
					item.id !== selected.id &&
					(item.genres.some((genre) => selected.genres.includes(genre)) || item.id in shortFilms)
			)
			.slice(0, 4)
	);
	function persist() {
		try {
			localStorage.setItem(
				'bedrock-frame-library-v1',
				JSON.stringify({ watchlist: [...watchlist], progress })
			);
		} catch {
			storageAvailable = false;
		}
	}
	function setupPlayback(video: HTMLVideoElement, id: string) {
		const resume = untrack(() => progress[id] ?? 0);
		let lastSaved = -1;
		function restore() {
			playbackError = false;
			if (resume > 0 && Number.isFinite(video.duration))
				video.currentTime = Math.min(resume, video.duration - 0.5);
		}
		function save() {
			if (!Number.isFinite(video.currentTime) || video.currentTime < 0.5) return;
			const seconds = Math.floor(video.currentTime);
			if (seconds === lastSaved) return;
			lastSaved = seconds;
			if (
				video.ended ||
				(Number.isFinite(video.duration) && video.currentTime >= video.duration - 0.5)
			) {
				delete progress[id];
			} else progress[id] = seconds;
			persist();
		}
		if (video.readyState >= 1) restore();
		else video.addEventListener('loadedmetadata', restore, { once: true });
		flushPlayback = save;
		const failed = () => (playbackError = true);
		video.addEventListener('error', failed, true);
		video.addEventListener('timeupdate', save);
		video.addEventListener('pause', save);
		video.addEventListener('seeked', save);
		video.addEventListener('ended', save);
		return () => {
			save();
			video.removeEventListener('error', failed, true);
			video.removeEventListener('loadedmetadata', restore);
			video.removeEventListener('timeupdate', save);
			video.removeEventListener('pause', save);
			video.removeEventListener('seeked', save);
			if (flushPlayback === save) flushPlayback = () => {};
			video.removeEventListener('ended', save);
		};
	}
	async function retryPlayback() {
		playbackError = false;
		playbackAttempt += 1;
		await tick();
		document.querySelector<HTMLElement>('[data-slot="video-player"]')?.focus();
	}
	async function changeMode(next: DialogMode) {
		dialogMode = next;
		playbackError = false;
		await tick();
		document
			.querySelector<HTMLElement>(
				next === 'player' ? '[data-slot="video-player"]' : '#detail-title'
			)
			?.focus();
	}
	async function chooseCategory(next: string) {
		category = next;
		await tick();
		document.querySelector<HTMLElement>('#category-results')?.focus({ preventScroll: true });
	}

	let view = $state<View>('discover');
	let watchlist = new SvelteSet<string>(['paper-suns', 'field-notes']);
	let dialogOpen = $state(false);
	let dialogMode = $state<DialogMode>('details');
	let selected = $state<VideoItem>(featured);
	let mobileMenuOpen = $state(false);
	let announcement = $state('');
	let dialogTrigger: HTMLElement | null = null;

	const normalizedQuery = $derived(query.trim().toLowerCase());
	const searchResults = $derived(
		normalizedQuery
			? catalogue.filter((item) =>
					[item.title, item.tagline, item.description, ...item.genres]
						.join(' ')
						.toLowerCase()
						.includes(normalizedQuery)
				)
			: []
	);
	const watchlistItems = $derived(catalogue.filter((item) => watchlist.has(item.id)));

	function toggleSaved(id: string) {
		if (watchlist.has(id)) watchlist.delete(id);
		else watchlist.add(id);
		persist();
		announcement = `${findVideo(id).title} ${watchlist.has(id) ? 'added to' : 'removed from'} your list.`;
	}

	function showDetails(item: VideoItem) {
		if (!dialogOpen)
			dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selected = item;
		dialogMode = 'details';
		dialogOpen = true;
	}

	function play(item: VideoItem) {
		if (!dialogOpen)
			dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selected = item;
		dialogMode = 'player';
		playbackError = false;
		dialogOpen = true;
	}

	async function switchView(next: View) {
		view = next;
		query = '';
		mobileMenuOpen = false;
		await tick();
		document.querySelector<HTMLElement>('#library-content')?.focus();
	}

	async function showDocumentaries() {
		await switchView('discover');
		const section = document.querySelector<HTMLElement>('#documentaries');
		section?.focus({ preventScroll: true });
		section?.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
		});
	}

	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
			const target = event.target;
			if (
				dialogOpen ||
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				(target instanceof HTMLElement && target.isContentEditable)
			)
				return;
			event.preventDefault();
			document.querySelector<HTMLInputElement>('#video-search')?.focus();
		}
	}
</script>

<svelte:head>
	<title>Frame — Video Library template</title>
	<meta
		name="description"
		content="A responsive video library template built with Bedrock UI components."
	/>
</svelte:head>

<svelte:window onkeydown={handleGlobalKeydown} onpagehide={() => flushPlayback()} />

<div
	class="video-library min-h-svh bg-background text-foreground"
	data-template="video-library"
	data-ready={ready}
>
	<a
		href="#library-content"
		class="fixed top-2 left-2 z-50 -translate-y-16 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:translate-y-0"
		>Skip to content</a
	>

	<header
		class="sticky top-0 z-40 border-b border-border/60 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/72"
	>
		<div class="mx-auto flex h-16 max-w-[100rem] items-center gap-3 px-4 sm:px-6">
			<Button
				variant="ghost"
				size="icon"
				class="lg:hidden"
				aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
				aria-expanded={mobileMenuOpen}
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				<Icon icon={mobileMenuOpen ? 'close' : 'menu'} />
			</Button>

			<a
				href="/templates/video-library"
				class="mr-1 flex shrink-0 items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
			>
				<span
					class="grid size-8 place-items-center rounded-[0.7rem] bg-foreground text-xs font-bold tracking-tight text-background"
					>FR</span
				>
				<span class="hidden text-base font-semibold tracking-tight sm:inline">Frame</span>
			</a>

			<nav aria-label="Primary" class="hidden items-center gap-1 lg:flex">
				<Button
					aria-pressed={view === 'discover'}
					variant={view === 'discover' ? 'secondary' : 'ghost'}
					onclick={() => switchView('discover')}>Discover</Button
				>
				<Button
					aria-pressed={view === 'watchlist'}
					variant={view === 'watchlist' ? 'secondary' : 'ghost'}
					onclick={() => switchView('watchlist')}>My list</Button
				>
				<Button variant="ghost" onclick={showDocumentaries}>Documentaries</Button>
			</nav>

			<div class="relative ml-auto w-full max-w-md">
				<label for="video-search" class="sr-only">Search titles and genres</label>
				<Icon
					icon="search"
					class="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					id="video-search"
					name="video-search"
					type="search"
					value={query}
					oninput={(event) => (query = event.currentTarget.value)}
					class="bg-muted/55 pr-14 pl-8"
					placeholder="Search Frame"
				/>
				<kbd
					class="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block"
					>/</kbd
				>
			</div>

			<Avatar.Root class="hidden size-8 sm:flex">
				<Avatar.Fallback class="bg-foreground text-xs font-semibold text-background"
					>JM</Avatar.Fallback
				>
			</Avatar.Root>
		</div>

		{#if mobileMenuOpen}
			<nav aria-label="Mobile primary" class="flex gap-2 border-t px-4 py-3 lg:hidden">
				<Button
					class="flex-1"
					aria-pressed={view === 'discover'}
					variant={view === 'discover' ? 'secondary' : 'ghost'}
					onclick={() => switchView('discover')}>Discover</Button
				>
				<Button
					class="flex-1"
					aria-pressed={view === 'watchlist'}
					variant={view === 'watchlist' ? 'secondary' : 'ghost'}
					onclick={() => switchView('watchlist')}>My list</Button
				>
			</nav>
		{/if}
	</header>

	<p role="status" class="sr-only">
		{normalizedQuery ? `${searchResults.length} titles found.` : announcement}
	</p>

	<main id="library-content" tabindex="-1" class="pb-20 outline-none">
		{#if normalizedQuery}
			<section
				class="mx-auto max-w-[100rem] px-4 pt-10 sm:px-6 lg:pt-14"
				aria-labelledby="search-heading"
			>
				<div class="mb-6 flex items-end justify-between gap-4">
					<div>
						<Text type="supporting" as="p" class="mb-1 tracking-[0.18em] uppercase">Search</Text>
						<Heading id="search-heading" level={1} visual="display-3"
							>Results for “{query.trim()}”</Heading
						>
					</div>
					<Text color="muted"
						>{searchResults.length} {searchResults.length === 1 ? 'title' : 'titles'}</Text
					>
				</div>
				{#if searchResults.length}
					<div
						class="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{#each searchResults as item (item.id)}
							<VideoCard
								{item}
								saved={watchlist.has(item.id)}
								onOpen={() => showDetails(item)}
								onToggleSaved={() => toggleSaved(item.id)}
							/>
						{/each}
					</div>
				{:else}
					<div
						class="grid min-h-72 place-items-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center"
					>
						<div class="max-w-sm">
							<Icon icon="search" class="mx-auto mb-4 size-7 text-muted-foreground" />
							<Heading level={2} visual={4}>Nothing matched that search</Heading>
							<Text as="p" color="muted" class="mt-2"
								>Try a title, mood, or genre such as “documentary”.</Text
							>
							<Button variant="outline" class="mt-5" onclick={() => (query = '')}
								>Clear search</Button
							>
						</div>
					</div>
				{/if}
			</section>
		{:else if view === 'watchlist'}
			<section
				class="mx-auto max-w-[100rem] px-4 pt-10 sm:px-6 lg:pt-14"
				aria-labelledby="watchlist-heading"
			>
				<Text type="supporting" as="p" class="mb-1 tracking-[0.18em] uppercase"
					>Saved for later</Text
				>
				<Heading id="watchlist-heading" level={1} visual="display-3">My list</Heading>
				<Text as="p" color="muted" class="mt-2 max-w-xl"
					>A quiet place for the stories you do not want to lose.</Text
				>
				{#if watchlistItems.length}
					<div
						class="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					>
						{#each watchlistItems as item (item.id)}
							<VideoCard
								{item}
								saved
								onOpen={() => showDetails(item)}
								onToggleSaved={() => toggleSaved(item.id)}
							/>
						{/each}
					</div>
				{:else}
					<div
						class="mt-8 grid min-h-72 place-items-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center"
					>
						<div class="max-w-sm">
							<Heading level={2} visual={4}>Your list is ready when you are</Heading>
							<Text as="p" color="muted" class="mt-2"
								>Save a title and it will wait here for movie night.</Text
							>
							<Button class="mt-5" onclick={() => switchView('discover')}
								>Explore the library</Button
							>
						</div>
					</div>
				{/if}
			</section>
		{:else}
			<section
				class="relative isolate min-h-[29rem] overflow-hidden border-b border-border/60 lg:min-h-[34rem]"
				aria-labelledby="featured-title"
			>
				<div class="absolute inset-0 -z-20">
					<img
						src={shortFilms['signal-above'].poster}
						alt=""
						width="960"
						height="540"
						class="size-full object-cover"
					/>
				</div>
				<div
					class="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/82 to-background/10"
				></div>
				<div
					class="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/20"
				></div>
				<div
					class="mx-auto flex min-h-[29rem] max-w-[100rem] items-end px-4 py-12 sm:px-6 lg:min-h-[34rem] lg:items-center lg:py-20"
				>
					<div class="max-w-2xl">
						<div class="mb-4 flex flex-wrap items-center gap-2">
							<Badge class="border-white/15 bg-foreground text-background">Frame original</Badge>
							<Badge variant="outline" class="border-foreground/25 bg-background/30 backdrop-blur"
								>New this week</Badge
							>
						</div>
						<Heading
							id="featured-title"
							level={1}
							visual="display-1"
							class="text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.075em] text-balance"
							>{featured.title}</Heading
						>
						<Text as="p" type="large" weight="medium" class="mt-6 max-w-xl text-balance"
							>{featured.tagline}</Text
						>
						<Text as="p" color="muted" class="mt-3 max-w-xl leading-relaxed text-pretty"
							>{featured.description}</Text
						>
						<div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
							<span>{featured.year}</span><span aria-hidden="true">·</span><span
								>{featured.rating}</span
							><span aria-hidden="true">·</span><span>{featured.duration}</span>
						</div>
						<div class="mt-7 flex flex-wrap gap-3">
							<Button size="lg" class="min-w-28" onclick={() => play(featured)}
								><Icon icon="play" data-icon="inline-start" />{progress[featured.id]
									? 'Resume'
									: 'Play'}</Button
							>
							<Button
								size="lg"
								variant="outline"
								class="border-foreground/20 bg-background/45 backdrop-blur hover:bg-background/70"
								onclick={() => showDetails(featured)}
								><Icon icon="info" data-icon="inline-start" />Details</Button
							>
							<IconButton
								icon={watchlist.has(featured.id) ? 'check' : 'add'}
								size="lg"
								variant="outline"
								class="border-foreground/20 bg-background/45 backdrop-blur hover:bg-background/70"
								label={watchlist.has(featured.id)
									? `Remove ${featured.title} from watchlist`
									: `Add ${featured.title} to watchlist`}
								onclick={() => toggleSaved(featured.id)}
								tooltip={watchlist.has(featured.id) ? 'Remove from my list' : 'Add to my list'}
							/>
						</div>
					</div>
				</div>
			</section>

			<div class="mx-auto max-w-[100rem] space-y-12 px-4 pt-10 sm:px-6 lg:space-y-16 lg:pt-14">
				{#if continueItems.length}<section aria-labelledby="continue-heading" class="space-y-5">
						<Heading id="continue-heading" level={2} visual={3}>Continue watching</Heading>
						<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{#each continueItems as item (item.id)}<div class="rounded-xl border bg-card p-4">
									<p class="font-semibold">{item.title}</p>
									<p class="my-2 text-sm text-muted-foreground">
										{progress[item.id]} seconds watched · {filmFor(item).title} short
									</p>
									<div class="mb-4 h-1 rounded bg-muted" aria-hidden="true">
										<div
											class="h-full rounded bg-primary"
											style:width={`${(progress[item.id] / 24) * 100}%`}
										></div>
									</div>
									<div class="flex gap-2">
										<Button onclick={() => play(item)}>Resume {item.title}</Button><Button
											variant="ghost"
											onclick={() => {
												delete progress[item.id];
												persist();
											}}>Remove progress</Button
										>
									</div>
								</div>{/each}
						</div>
					</section>{/if}

				<section aria-labelledby="browse-heading" class="space-y-5">
					<div class="flex flex-wrap items-end justify-between gap-3">
						<Heading id="browse-heading" level={2} visual={3}>Find your next story</Heading><Text
							color="muted"
							type="supporting">Two original shorts, a whole world of possibilities</Text
						>
					</div>
					<div class="flex flex-wrap gap-2" aria-label="Browse categories">
						{#each categories as name (name)}<Button
								size="sm"
								variant={category === name ? 'default' : 'outline'}
								aria-pressed={category === name}
								onclick={() => chooseCategory(name)}>{name}</Button
							>{/each}
					</div>
					<div id="category-results" tabindex="-1" class="outline-none">
						<p class="mb-4 text-sm text-muted-foreground" role="status">
							{categoryItems.length} titles · {category}
						</p>
						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{#each categoryItems as item (item.id)}<VideoCard
									{item}
									saved={watchlist.has(item.id)}
									onOpen={() => showDetails(item)}
									onToggleSaved={() => toggleSaved(item.id)}
								/>{/each}
						</div>
					</div>
				</section>
				{#each rails as rail, railIndex (rail.title)}
					<section
						id={railIndex === 3 ? 'documentaries' : undefined}
						tabindex="-1"
						aria-labelledby={`rail-${railIndex}`}
					>
						<div class="mb-5 flex items-end justify-between gap-4">
							<Heading id={`rail-${railIndex}`} level={2} visual={3}>{rail.title}</Heading>
							<Text color="muted" type="supporting" class="hidden sm:inline">Scroll to explore</Text
							>
						</div>
						<ScrollArea
							orientation="horizontal"
							edgeBlur="horizontal"
							class="-mx-4 w-[calc(100%+2rem)] px-4 sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6"
							scrollbarXClasses="invisible"
						>
							<div class="flex snap-x snap-mandatory gap-4 pb-4">
								{#each rail.ids as id (id)}
									{@const item = findVideo(id)}
									<VideoCard
										{item}
										saved={watchlist.has(item.id)}
										progress={progress[item.id] ? (progress[item.id] / 24) * 100 : undefined}
										onOpen={() => showDetails(item)}
										onToggleSaved={() => toggleSaved(item.id)}
									/>
								{/each}
							</div>
						</ScrollArea>
					</section>
				{/each}
			</div>
		{/if}
	</main>

	<footer class="border-t bg-muted/20">
		<div
			class="mx-auto flex max-w-[100rem] flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"
		>
			<div>
				<span class="font-semibold text-foreground">Frame</span> · Fictional catalogue, two original
				silent shorts
				<p class="mt-1 text-xs">
					{storageAvailable
						? 'Your list and playback progress stay in this browser.'
						: 'Browser storage is unavailable; changes last for this visit.'}
				</p>
			</div>
			<a
				href="/docs/templates"
				class="rounded underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
				>Back to Bedrock templates</a
			>
		</div>
	</footer>

	<Dialog.Root
		open={dialogOpen}
		onOpenChange={(open) => {
			if (!open) flushPlayback();
			dialogOpen = open;
		}}
	>
		<Dialog.Content
			class="max-h-[92svh] max-w-4xl overflow-y-auto p-0"
			showCloseButton
			onCloseAutoFocus={(event) => {
				event.preventDefault();
				dialogTrigger?.focus();
			}}
		>
			<Dialog.Header class="sr-only">
				<Dialog.Title
					>{dialogMode === 'player' ? `Playing ${selected.title}` : selected.title}</Dialog.Title
				>
				<Dialog.Description>{selected.description}</Dialog.Description>
			</Dialog.Header>

			{#key dialogMode + selected.id + playbackAttempt}<div class="film-surface">
					{#if dialogMode === 'player'}
						<div class="bg-black pt-12 sm:pt-0">
							<VideoPlayer
								src={filmFor(selected).src}
								poster={filmFor(selected).poster}
								tabindex={-1}
								mediaSetup={(video) => setupPlayback(video, selected.id)}
								onError={() => (playbackError = true)}
								label={`${selected.title} video player`}
								captions={[
									{ src: filmFor(selected).captions, srclang: 'en', label: 'Visual descriptions' }
								]}
								class="aspect-video rounded-none border-0"
							/>
						</div>
						<div class="p-5 sm:p-7">
							<div class="flex items-start justify-between gap-4">
								<div>
									<Text as="p" color="muted" class="mb-3"
										>{selected.id in shortFilms
											? 'Original silent motion film · 24 seconds · Created for Bedrock'
											: `Catalogue preview: ${filmFor(selected).title}, an original 24-second silent film. This fictional title has no full-length video.`}</Text
									>
									<Text type="supporting" as="p" class="mb-1 tracking-[0.16em] uppercase"
										>Now playing</Text
									>
									<Heading level={2} visual={3}>{selected.title}</Heading>
								</div>
								<Button variant="outline" onclick={() => changeMode('details')}>View details</Button
								>
							</div>
						</div>
					{:else}
						<div class="relative h-60 overflow-hidden sm:h-80">
							{#if selected.id in shortFilms}<img
									src={filmFor(selected).poster}
									alt=""
									width="960"
									height="540"
									class="size-full object-cover"
								/>{:else}<PosterArt tone={selected.tone} mark={selected.mark} wide />{/if}
							<div
								class="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"
							></div>
						</div>
						<div
							class="-mt-10 grid gap-7 px-5 pb-6 sm:px-8 sm:pb-8 md:grid-cols-[minmax(0,1fr)_14rem]"
						>
							<div class="relative">
								<Heading
									id="detail-title"
									tabindex={-1}
									level={2}
									visual="display-3"
									class="text-balance outline-none">{selected.title}</Heading
								>
								<Text as="p" type="large" weight="medium" class="mt-2">{selected.tagline}</Text>
								<Text as="p" color="muted" class="mt-4 leading-relaxed">{selected.description}</Text
								>
								<div class="mt-6 flex flex-wrap gap-3">
									<Button size="lg" onclick={() => changeMode('player')}
										><Icon icon="play" data-icon="inline-start" />{progress[selected.id]
											? 'Resume'
											: 'Play'}</Button
									>
									<Button size="lg" variant="outline" onclick={() => toggleSaved(selected.id)}
										><Icon
											icon={watchlist.has(selected.id) ? 'check' : 'add'}
											data-icon="inline-start"
										/>{watchlist.has(selected.id) ? 'In my list' : 'Add to my list'}</Button
									>
								</div>
							</div>
							<dl class="relative space-y-4 text-sm">
								<div>
									<dt class="text-xs text-muted-foreground">Release</dt>
									<dd class="mt-1 font-medium">{selected.year}</dd>
								</div>
								<div>
									<dt class="text-xs text-muted-foreground">Runtime</dt>
									<dd class="mt-1 font-medium">{selected.duration}</dd>
								</div>
								<div>
									<dt class="text-xs text-muted-foreground">Rating</dt>
									<dd class="mt-1 font-medium">{selected.rating}</dd>
								</div>
								<div>
									<dt class="text-xs text-muted-foreground">Genres</dt>
									<dd class="mt-1 font-medium">{selected.genres.join(', ')}</dd>
								</div>
							</dl>
						</div>
					{/if}
					{#if playbackError}<div
							data-testid="film-error"
							role="alert"
							class="mx-5 mb-5 rounded-lg border bg-muted p-4"
						>
							<p class="text-sm">
								The local film could not load. Check your connection, then try again.
							</p>
							<Button variant="outline" class="mt-3" onclick={retryPlayback}>Reload film</Button>
						</div>{/if}
				</div>{/key}
			<section class="border-t p-5 sm:p-7" aria-labelledby="related-heading">
				<Heading id="related-heading" level={3} visual={4}>More to explore</Heading>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each related as item (item.id)}<Button
							variant="outline"
							class="h-auto justify-start py-3 text-left"
							onclick={() => {
								selected = item;
								changeMode('details');
							}}
							><span
								><span class="block font-medium">{item.title}</span><span
									class="block text-xs text-muted-foreground">{item.genres.join(' · ')}</span
								></span
							></Button
						>{/each}
				</div>
			</section>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style>
	.video-library {
		--radius: 0.8rem;
	}

	.film-surface {
		animation: library-reveal var(--motion-enter) var(--motion-ease-enter);
	}
	@keyframes library-reveal {
		from {
			opacity: 0.5;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.video-library :global(*),
		.film-surface {
			scroll-behavior: auto !important;
			animation: none !important;
		}
	}
</style>
