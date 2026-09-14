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
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { catalogue, featured, findVideo, rails, type VideoItem } from './catalog.js';
	import PosterArt from './PosterArt.svelte';
	import VideoCard from './VideoCard.svelte';

	type DialogMode = 'details' | 'player';
	type View = 'discover' | 'watchlist';

	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	let query = $state('');
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
		announcement = `${findVideo(id).title} ${watchlist.has(id) ? 'added to' : 'removed from'} your list.`;
	}

	function showDetails(item: VideoItem) {
		dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selected = item;
		dialogMode = 'details';
		dialogOpen = true;
	}

	function play(item: VideoItem) {
		dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selected = item;
		dialogMode = 'player';
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

<svelte:window onkeydown={handleGlobalKeydown} />

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
				class="relative isolate min-h-[34rem] overflow-hidden border-b border-border/60 lg:min-h-[42rem]"
				aria-labelledby="featured-title"
			>
				<div class="absolute inset-0 -z-20">
					<PosterArt tone={featured.tone} mark={featured.mark} wide />
				</div>
				<div
					class="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/82 to-background/10"
				></div>
				<div
					class="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/20"
				></div>
				<div
					class="mx-auto flex min-h-[34rem] max-w-[100rem] items-end px-4 py-12 sm:px-6 lg:min-h-[42rem] lg:items-center lg:py-20"
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
								><Icon icon="play" data-icon="inline-start" />Play</Button
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
								{#each rail.ids as id, index (id)}
									{@const item = findVideo(id)}
									<VideoCard
										{item}
										saved={watchlist.has(item.id)}
										progress={railIndex === 0 ? [62, 28, 84, 11][index] : undefined}
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
				<span class="font-semibold text-foreground">Frame</span> · Fictional video library template
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
			dialogOpen = open;
			if (!open) dialogMode = 'details';
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

			{#if dialogMode === 'player'}
				<div class="bg-black pt-12 sm:pt-0">
					<VideoPlayer
						src="/demo/clip.mp4"
						label={`${selected.title} video player`}
						captions={[
							{ src: '/demo/clip.en.vtt', srclang: 'en', label: 'English', default: true }
						]}
						class="aspect-video rounded-none border-0"
					/>
				</div>
				<div class="p-5 sm:p-7">
					<div class="flex items-start justify-between gap-4">
						<div>
							<Text as="p" color="muted" class="mb-3"
								>Demo footage — every fictional title plays the same local sample.</Text
							>
							<Text type="supporting" as="p" class="mb-1 tracking-[0.16em] uppercase"
								>Now playing</Text
							>
							<Heading level={2} visual={3}>{selected.title}</Heading>
						</div>
						<Button variant="outline" onclick={() => (dialogMode = 'details')}>View details</Button>
					</div>
				</div>
			{:else}
				<div class="relative h-60 overflow-hidden sm:h-80">
					<PosterArt tone={selected.tone} mark={selected.mark} wide />
					<div
						class="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"
					></div>
				</div>
				<div class="-mt-10 grid gap-7 px-5 pb-6 sm:px-8 sm:pb-8 md:grid-cols-[minmax(0,1fr)_14rem]">
					<div class="relative">
						<Heading level={2} visual="display-3" class="text-balance">{selected.title}</Heading>
						<Text as="p" type="large" weight="medium" class="mt-2">{selected.tagline}</Text>
						<Text as="p" color="muted" class="mt-4 leading-relaxed">{selected.description}</Text>
						<div class="mt-6 flex flex-wrap gap-3">
							<Button size="lg" onclick={() => (dialogMode = 'player')}
								><Icon icon="play" data-icon="inline-start" />Play</Button
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
		</Dialog.Content>
	</Dialog.Root>
</div>

<style>
	.video-library {
		--radius: 0.8rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.video-library :global(*) {
			scroll-behavior: auto !important;
		}
	}
</style>
