<script lang="ts">
	import BellIcon from '@lucide/svelte/icons/bell';
	import BookmarkIcon from '@lucide/svelte/icons/bookmark';
	import CheckIcon from '@lucide/svelte/icons/check';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import HomeIcon from '@lucide/svelte/icons/house';
	import ImageIcon from '@lucide/svelte/icons/image';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import PenLineIcon from '@lucide/svelte/icons/pen-line';
	import Repeat2Icon from '@lucide/svelte/icons/repeat-2';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SendIcon from '@lucide/svelte/icons/send';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { Avatar, AvatarFallback } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Input } from '#lib/bedrock/ui/input';
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Separator } from '#lib/bedrock/ui/separator';
	import * as Sheet from '#lib/bedrock/ui/sheet';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import ThemeToggle from '#lib/site/ThemeToggle.svelte';
	import {
		initialPosts,
		notifications,
		people,
		suggestions,
		topics,
		type FeedPost,
		type Person
	} from './social-data';

	const navItems = [
		{ label: 'Home', icon: HomeIcon },
		{ label: 'Discover', icon: SparklesIcon },
		{ label: 'Circles', icon: UsersIcon },
		{ label: 'Saved', icon: BookmarkIcon },
		{ label: 'Profile', icon: UserRoundIcon }
	] as const;

	let mounted = $state(false);
	const activeNav = $derived(
		mounted && navItems.some((item) => item.label === page.url.searchParams.get('view'))
			? page.url.searchParams.get('view')!
			: 'Home'
	);
	const openThreadId = $derived(mounted ? page.url.searchParams.get('thread') : null);
	let profileName = $state(people.mina.name);
	let profileBio = $state(
		'Designing useful things. Collecting field notes, generous ideas, and small moments outside.'
	);
	let editingProfile = $state(false);
	let editedName = $state('');
	let editedBio = $state('');
	let unreadOnly = $state(false);
	let attachmentAlt = $state('An original field map showing shaded paths and gathering places');
	const hiddenPosts = new SvelteSet<string>();
	let lastHidden = $state<string | null>(null);
	const currentPerson = $derived({ ...people.mina, name: profileName });
	const selectedProfile = $derived(
		mounted
			? ([currentPerson, ...Object.values(people).filter((person) => person.id !== 'mina')].find(
					(person) => person.id === page.url.searchParams.get('profile')
				) ?? null)
			: null
	);
	onMount(() => {
		mounted = true;
		try {
			draft = localStorage.getItem('mosaic-draft-v1') ?? '';
		} catch {
			/* Storage is optional. */
		}
	});
	function updateDraft(value: string) {
		draft = value;
		try {
			localStorage.setItem('mosaic-draft-v1', value);
		} catch {
			/* The in-memory draft remains usable. */
		}
	}
	function navigate(values: Record<string, string | null>) {
		const url = new URL(page.url.href);
		for (const [key, value] of Object.entries(values)) {
			if (value) url.searchParams.set(key, value);
			else url.searchParams.delete(key);
		}
		return goto(url, { reset: false });
	}
	function hidePost(id: string) {
		hiddenPosts.add(id);
		lastHidden = id;
		announcement = 'Note hidden. You can undo this action.';
	}
	function undoHide() {
		if (lastHidden) hiddenPosts.delete(lastHidden);
		lastHidden = null;
		announcement = 'Note restored.';
	}

	let feedView = $state('following');
	let draft = $state('');
	let posts = $state<FeedPost[]>(initialPosts.map((post) => ({ ...post })));
	const following = new SvelteSet<string>(['sora']);
	let announcement = $state('');
	let mobileMenuOpen = $state(false);
	let notificationsOpen = $state(false);
	let search = $state('');

	let replyDraft = $state('');
	let attachArt = $state(false);
	const readNotifications = new SvelteSet<string>();
	const visiblePosts = $derived.by(() => {
		let result = posts
			.filter((post) => !hiddenPosts.has(post.id))
			.filter((post) =>
				`${post.content} ${post.author.name} ${post.topic ?? ''}`
					.toLowerCase()
					.includes(search.toLowerCase().trim())
			);
		if (activeNav === 'Saved') result = result.filter((post) => post.bookmarked);
		if (activeNav === 'Profile')
			result = result.filter((post) => post.author.id === people.mina.id);
		if (activeNav === 'Circles') result = result.filter((post) => following.has(post.author.id));
		return feedView === 'discover' ? [...result].sort((a, b) => b.likes - a.likes) : result;
	});
	const remaining = $derived(320 - draft.length);
	const canPublish = $derived(
		draft.trim().length > 0 && remaining >= 0 && (!attachArt || attachmentAlt.trim().length > 0)
	);
	const unreadCount = $derived(
		notifications.filter((item) => item.unread && !readNotifications.has(item.id)).length
	);

	function avatarTone(person: Person) {
		return `bg-gradient-to-br ${person.tone}`;
	}

	function publish() {
		if (!canPublish) return;
		const nextPost: FeedPost = {
			id: `local-${Date.now()}`,
			author: currentPerson,
			time: 'now',
			content: draft.trim(),
			likes: 0,
			reposts: 0,
			views: '1',
			image:
				attachArt && initialPosts[0].image
					? { ...initialPosts[0].image, alt: attachmentAlt.trim() }
					: undefined,
			replies: []
		};
		posts = [nextPost, ...posts];
		updateDraft('');
		attachArt = false;
		navigate({ view: 'Home', thread: null, profile: null });
		search = '';
		announcement = 'Your note was published.';
	}

	function toggleReaction(postId: string, reaction: 'liked' | 'reposted' | 'bookmarked') {
		posts = posts.map((post) => {
			if (post.id !== postId) return post;
			const enabled = !post[reaction];
			return {
				...post,
				[reaction]: enabled,
				likes: reaction === 'liked' ? post.likes + (enabled ? 1 : -1) : post.likes,
				reposts: reaction === 'reposted' ? post.reposts + (enabled ? 1 : -1) : post.reposts
			};
		});
		announcement = `${reaction === 'bookmarked' ? 'Saved' : reaction === 'liked' ? 'Appreciation' : 'Repost'} ${posts.find((post) => post.id === postId)?.[reaction] ? 'added' : 'removed'}.`;
	}

	function toggleFollow(person: Person) {
		if (following.has(person.id)) following.delete(person.id);
		else following.add(person.id);
		announcement = `${following.has(person.id) ? 'Following' : 'Unfollowed'} ${person.name}.`;
	}

	function toggleThread(postId: string) {
		replyDraft = '';
		navigate({ thread: openThreadId === postId ? null : postId });
	}

	function sendReply(postId: string) {
		if (!replyDraft.trim()) return;
		posts = posts.map((post) =>
			post.id === postId
				? {
						...post,
						replies: [
							...post.replies,
							{
								id: `reply-${Date.now()}`,
								author: currentPerson,
								time: 'now',
								content: replyDraft.trim(),
								likes: 0
							}
						]
					}
				: post
		);
		replyDraft = '';
		announcement = 'Reply added to the conversation.';
	}

	async function chooseNav(label: string) {
		const navigation = navigate({ view: label, thread: null, profile: null });
		search = '';
		feedView = label === 'Discover' ? 'discover' : 'following';
		mobileMenuOpen = false;
		announcement = `${label} view selected.`;
		await navigation;
		await tick();
		document.querySelector<HTMLElement>('#feed-title')?.focus();
	}
</script>

<svelte:head>
	<title>Mosaic — Social Network Template</title>
	<meta
		name="description"
		content="A responsive social network template built from Bedrock UI components."
	/>
</svelte:head>

<div class="social-shell min-h-svh bg-background text-foreground">
	<a
		href="#social-feed"
		class="fixed top-3 left-3 z-[70] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:translate-y-0"
	>
		Skip to feed
	</a>

	<div aria-live="polite" class="sr-only" role="status">{announcement}</div>

	<header class="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-[1480px] items-center gap-3 px-3 sm:px-5 lg:px-8">
			<Sheet.Root open={mobileMenuOpen} onOpenChange={(open) => (mobileMenuOpen = open)}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<IconButton {...props} class="lg:hidden" icon={MenuIcon} label="Open navigation" />
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="left" class="w-[min(86vw,320px)] p-0">
					<Sheet.Header class="border-b p-5 text-left">
						<Sheet.Title>Mosaic</Sheet.Title>
						<Sheet.Description>Choose a place to continue.</Sheet.Description>
					</Sheet.Header>
					<nav class="grid gap-1 p-3" aria-label="Mobile primary navigation">
						{#each navItems as item (item.label)}
							<Button
								variant={activeNav === item.label ? 'secondary' : 'ghost'}
								class="justify-start gap-3"
								aria-pressed={activeNav === item.label}
								onclick={() => chooseNav(item.label)}
							>
								<item.icon class="size-4" />
								{item.label}
							</Button>
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<a
				href="/docs/templates"
				class="group flex shrink-0 items-center gap-2"
				aria-label="Back to template catalogue"
			>
				<span
					class="grid size-8 place-items-center rounded-[10px] bg-foreground text-sm font-semibold text-background transition-transform duration-[var(--motion-state)] group-hover:-rotate-3"
					aria-hidden="true">M</span
				>
				<span class="hidden text-lg font-semibold tracking-tight sm:block">Mosaic</span>
			</a>

			<div class="relative mx-auto max-w-xl flex-1">
				<SearchIcon
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					disabled={!mounted}
					value={search}
					oninput={(event) => (search = event.currentTarget.value)}
					name="social-search"
					aria-label="Search people and notes"
					placeholder="Search Mosaic"
					class="h-10 rounded-full bg-muted/70 pr-4 pl-9 shadow-none"
				/>
			</div>

			<Sheet.Root open={notificationsOpen} onOpenChange={(open) => (notificationsOpen = open)}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<span class="relative">
							<IconButton {...props} icon={BellIcon} label="Open notifications" />
							{#if unreadCount}
								<span
									class="absolute top-1 right-1 size-2 rounded-full bg-orange-500 ring-2 ring-background"
									aria-hidden="true"
								></span>
							{/if}
						</span>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content class="w-full p-0 sm:max-w-md">
					<Sheet.Header class="border-b p-5 text-left">
						<Sheet.Title>Notifications</Sheet.Title>
						<Sheet.Description
							>{unreadCount}
							{unreadCount === 1 ? 'update' : 'updates'} waiting for you</Sheet.Description
						>
					</Sheet.Header>
					<div class="flex flex-wrap gap-2 border-b p-4">
						<Button
							size="sm"
							variant={unreadOnly ? 'secondary' : 'outline'}
							aria-pressed={unreadOnly}
							onclick={() => (unreadOnly = !unreadOnly)}>Unread only</Button
						>
						<Button
							size="sm"
							variant="ghost"
							disabled={!unreadCount}
							onclick={() => {
								notifications.forEach((item) => readNotifications.add(item.id));
								announcement = 'All updates marked as read.';
							}}>Mark all read</Button
						>
					</div>
					<div class="grid gap-1 p-3">
						{#if unreadOnly && unreadCount === 0}<p
								class="p-5 text-sm text-muted-foreground"
								role="status"
							>
								You are all caught up. Switch off Unread only to revisit earlier updates.
							</p>{/if}
						{#each notifications.filter((item) => !unreadOnly || (item.unread && !readNotifications.has(item.id))) as item (item.id)}
							<button
								onclick={() => {
									readNotifications.add(item.id);
									announcement = 'Update marked as read.';
								}}
								class="flex w-full gap-3 rounded-xl p-3 text-left motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							>
								<Avatar class="size-10 shrink-0">
									<AvatarFallback class={avatarTone(item.person)}
										>{item.person.initials}</AvatarFallback
									>
								</Avatar>
								<span class="min-w-0 text-sm leading-relaxed">
									<strong>{item.person.name}</strong>
									{item.message}
									<span class="mt-1 block text-xs text-muted-foreground">{item.time}</span>
								</span>
								{#if item.unread && !readNotifications.has(item.id)}<span
										class="mt-2 size-2 shrink-0 rounded-full bg-orange-500"
									></span>{/if}
							</button>
						{/each}
					</div>
				</Sheet.Content>
			</Sheet.Root>
			<ThemeToggle />
			<Avatar class="hidden size-8 sm:flex">
				<AvatarFallback class={avatarTone(people.mina)}>{people.mina.initials}</AvatarFallback>
			</Avatar>
		</div>
	</header>

	<div
		class="mx-auto grid max-w-[1480px] grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)_280px] xl:grid-cols-[240px_minmax(0,720px)_320px]"
	>
		<aside class="sticky top-16 hidden h-[calc(100svh-4rem)] border-r lg:block">
			<div class="flex h-full flex-col justify-between p-4 xl:p-6">
				<nav class="grid gap-1" aria-label="Social primary navigation">
					{#each navItems as item (item.label)}
						<Button
							variant={activeNav === item.label ? 'secondary' : 'ghost'}
							class="h-11 justify-start gap-3 rounded-xl text-[0.94rem]"
							aria-pressed={activeNav === item.label}
							onclick={() => chooseNav(item.label)}
						>
							<item.icon class="size-[18px]" />
							{item.label}
							{#if item.label === 'Home' && activeNav === item.label}
								<span class="ml-auto size-1.5 rounded-full bg-orange-500"></span>
							{/if}
						</Button>
					{/each}
					<Button
						class="mt-4 h-11 gap-2 rounded-xl"
						onclick={() => document.querySelector<HTMLTextAreaElement>('#new-note')?.focus()}
					>
						<PenLineIcon class="size-4" /> New note
					</Button>
				</nav>

				<Card.Root class="overflow-hidden border-0 bg-muted/70 shadow-none">
					<Card.Content class="p-4">
						<div class="mb-3 flex items-center gap-3">
							<Avatar class="size-9">
								<AvatarFallback class={avatarTone(people.mina)}
									>{people.mina.initials}</AvatarFallback
								>
							</Avatar>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium">{profileName}</p>
								<p class="truncate text-xs text-muted-foreground">{people.mina.handle}</p>
							</div>
						</div>
						<p class="text-xs leading-relaxed text-muted-foreground">
							Your weekly circle is 64% quieter than average.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</aside>

		<main id="social-feed" class="min-w-0 pb-20 lg:pb-8">
			<div class="border-b px-4 pt-5 sm:px-6">
				<div class="mb-5 flex items-end justify-between gap-4">
					<div>
						<p class="mb-1 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
							{activeNav}
						</p>
						<h1
							id="feed-title"
							tabindex="-1"
							class="text-2xl font-semibold tracking-tight outline-none"
						>
							{activeNav === 'Home'
								? 'Your corner of the internet'
								: activeNav === 'Profile'
									? 'Your notes'
									: activeNav === 'Saved'
										? 'Notes worth keeping'
										: activeNav === 'Circles'
											? 'From your circle'
											: 'Fresh perspectives'}
						</h1>
					</div>
					<Badge variant="secondary" class="hidden rounded-full sm:inline-flex">Quiet mode</Badge>
				</div>

				<div class="flex gap-2 pb-3" role="group" aria-label="Feed order">
					<Button
						variant={feedView === 'following' ? 'secondary' : 'ghost'}
						aria-pressed={feedView === 'following'}
						onclick={() => (feedView = 'following')}>Latest</Button
					>
					<Button
						variant={feedView === 'discover' ? 'secondary' : 'ghost'}
						aria-pressed={feedView === 'discover'}
						onclick={() => (feedView = 'discover')}>Popular</Button
					>
				</div>
			</div>

			{#key activeNav}
				<div class="screen-intro">
					{#if activeNav === 'Profile'}
						<section
							class="profile-cover m-4 rounded-2xl border p-6 sm:m-6"
							aria-label="Your profile"
						>
							<p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
								Member since spring 2024
							</p>
							<div class="mt-6 flex flex-wrap items-center gap-4">
								<Avatar class="size-16"
									><AvatarFallback class={avatarTone(currentPerson)}>MO</AvatarFallback></Avatar
								>
								<div>
									<h2 class="text-2xl font-semibold">{profileName}</h2>
									<p class="text-sm text-muted-foreground">{people.mina.handle}</p>
								</div>
							</div>
							<p class="mt-4 max-w-lg leading-relaxed">{profileBio}</p>
							<p class="my-4 text-sm text-muted-foreground">
								{posts.filter((post) => post.author.id === 'mina').length} notes · {following.size} following
								· 128 followers
							</p>
							<Button
								variant="outline"
								onclick={() => {
									editedName = profileName;
									editedBio = profileBio;
									editingProfile = !editingProfile;
								}}>{editingProfile ? 'Close editor' : 'Edit profile'}</Button
							>
							{#if editingProfile}<form
									class="mt-4 grid gap-3"
									onsubmit={(event) => {
										event.preventDefault();
										profileName = editedName.trim();
										profileBio = editedBio.trim();
										posts = posts.map((post) =>
											post.author.id === 'mina' ? { ...post, author: currentPerson } : post
										);
										editingProfile = false;
										announcement = 'Profile updated.';
									}}
								>
									<label class="grid gap-1 text-sm"
										>Display name<Input
											value={editedName}
											oninput={(event) => (editedName = event.currentTarget.value)}
											required
											maxlength={48}
										/></label
									><label class="grid gap-1 text-sm"
										>About you<Textarea
											value={editedBio}
											oninput={(event) => (editedBio = event.currentTarget.value)}
											maxlength={180}
										/></label
									><Button type="submit" disabled={!editedName.trim()}>Save profile</Button>
								</form>{/if}
						</section>
					{:else if activeNav === 'Discover' || activeNav === 'Circles'}
						<section
							class="m-4 rounded-2xl border bg-muted/30 p-5 sm:m-6"
							aria-label="Explore circles"
						>
							<p class="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
								Find your people
							</p>
							<h2 class="mt-2 text-xl font-semibold">Small circles. Wider perspectives.</h2>
							<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
								Follow a voice to bring their notes into your circle.
							</p>
							<div class="mt-4 grid gap-3">
								{#each suggestions as person (person.id)}<div class="flex items-center gap-3">
										<Avatar
											><AvatarFallback class={avatarTone(person)}>{person.initials}</AvatarFallback
											></Avatar
										><button
											class="min-w-0 flex-1 text-left text-sm underline-offset-4 hover:underline focus-visible:outline-2"
											onclick={() => navigate({ profile: person.id })}
											><strong class="block">{person.name}</strong><span
												class="text-muted-foreground">{person.role}</span
											></button
										><Button
											size="sm"
											variant="outline"
											aria-pressed={following.has(person.id)}
											onclick={() => toggleFollow(person)}
											>{following.has(person.id) ? 'Following' : 'Follow'}</Button
										>
									</div>{/each}
							</div>
						</section>
					{/if}
				</div>
			{/key}
			{#if lastHidden}<div
					class="mx-4 my-3 flex items-center justify-between gap-3 rounded-xl border bg-muted p-3 text-sm"
					role="status"
				>
					Note hidden from your feed.<Button size="sm" variant="outline" onclick={undoHide}
						>Undo hide</Button
					>
				</div>{/if}
			<section class="border-b p-4 sm:p-6" aria-labelledby="composer-heading">
				<div class="flex gap-3">
					<Avatar class="mt-0.5 size-10 shrink-0">
						<AvatarFallback class={avatarTone(people.mina)}>{people.mina.initials}</AvatarFallback>
					</Avatar>
					<div class="min-w-0 flex-1">
						<h2 id="composer-heading" class="sr-only">Write a new note</h2>
						<Textarea
							id="new-note"
							disabled={!mounted}
							value={draft}
							oninput={(event) => updateDraft(event.currentTarget.value)}
							maxlength={320}
							placeholder="Share something worth keeping…"
							aria-label="Write a new note"
							aria-describedby="composer-limit"
							class="min-h-24 resize-none border-0 bg-transparent p-0 text-[1rem] leading-relaxed shadow-none focus-visible:ring-2"
						></Textarea>
						{#if attachArt}<div
								class="mt-3 rounded-xl border bg-emerald-50 p-3 dark:bg-emerald-950"
							>
								<img
									src="/templates/social-network/field-map.svg"
									alt={attachmentAlt}
									class="h-32 w-full rounded-lg object-cover"
								/>
								<p class="mt-2 text-xs text-muted-foreground">Original community field map</p>
								<label class="mt-3 grid gap-1 text-sm"
									>Image description<Input
										value={attachmentAlt}
										oninput={(event) => (attachmentAlt = event.currentTarget.value)}
										maxlength={200}
										placeholder="Describe the image for someone who cannot see it"
									/></label
								>
							</div>{/if}
						<p class="mt-2 text-xs text-muted-foreground">
							Draft text stays in this browser until you publish.
						</p>
						<Separator class="my-3" />
						<div class="flex items-center gap-2">
							<IconButton
								icon={ImageIcon}
								label={attachArt ? 'Remove field map' : 'Attach sample field map'}
								aria-pressed={attachArt}
								onclick={() => (attachArt = !attachArt)}
								size="sm"
							/>
							{#if attachArt}<span class="text-xs text-muted-foreground">Field map attached</span
								>{/if}
							<span
								id="composer-limit"
								class={[
									'ml-auto text-xs tabular-nums',
									remaining < 40 ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'
								]}>{remaining}</span
							>
							<Button size="sm" class="rounded-full px-4" disabled={!canPublish} onclick={publish}>
								Publish <SendIcon class="size-3.5" />
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section aria-label={`${feedView === 'following' ? 'Following' : 'Discover'} feed`}>
				{#each visiblePosts as post (post.id)}
					<article class="post-card border-b px-4 py-5 sm:px-6" data-post-id={post.id}>
						<div class="flex gap-3">
							<button
								class="h-fit rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
								aria-label={`Open ${post.author.name}'s profile`}
								onclick={() => navigate({ profile: post.author.id })}
							>
								<Avatar class="size-10">
									<AvatarFallback class={avatarTone(post.author)}
										>{post.author.initials}</AvatarFallback
									>
								</Avatar>
							</button>
							<div class="min-w-0 flex-1">
								<header class="flex items-start gap-2">
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm">
											<strong>{post.author.name}</strong>
											<span class="ml-1 text-muted-foreground"
												>{post.author.handle} · {post.time}</span
											>
										</p>
										{#if post.topic}<p class="mt-0.5 text-xs text-muted-foreground">
												in {post.topic}
											</p>{/if}
									</div>
									<Button
										size="sm"
										variant="ghost"
										aria-label={`Hide note by ${post.author.name}`}
										onclick={() => hidePost(post.id)}>Hide</Button
									>
								</header>

								<p class="mt-3 text-[0.965rem] leading-6 text-foreground/90">{post.content}</p>

								{#if post.image}
									<figure
										class={`visual-note mt-4 overflow-hidden rounded-2xl border bg-gradient-to-br ${post.image.tone}`}
									>
										<img
											src={post.image.src ?? '/templates/social-network/field-map.svg'}
											alt={post.image.alt}
											class="aspect-[16/9] w-full object-cover"
											loading="lazy"
										/>
										<figcaption
											class="px-4 py-3 text-xs font-medium text-emerald-950/75 dark:text-emerald-100/80"
										>
											{post.image.caption}
										</figcaption>
									</figure>
								{/if}

								<div
									class="mt-3 flex items-center justify-between text-muted-foreground sm:max-w-lg"
								>
									<button
										class="reaction motion-state"
										aria-expanded={openThreadId === post.id}
										aria-controls={`thread-${post.id}`}
										onclick={() => toggleThread(post.id)}
									>
										<MessageCircleIcon class="size-[18px]" /> <span>{post.replies.length}</span>
										<span class="sr-only">replies</span>
									</button>
									<button
										class={[
											'reaction motion-state',
											post.reposted ? 'text-emerald-600 dark:text-emerald-400' : ''
										]}
										aria-pressed={post.reposted}
										onclick={() => toggleReaction(post.id, 'reposted')}
									>
										<Repeat2Icon class="size-[18px]" /> <span>{post.reposts}</span>
										<span class="sr-only">reposts</span>
									</button>
									<button
										class={[
											'reaction motion-state',
											post.liked ? 'text-rose-600 dark:text-rose-400' : ''
										]}
										aria-pressed={post.liked}
										onclick={() => toggleReaction(post.id, 'liked')}
									>
										<HeartIcon class={['size-[18px]', post.liked ? 'fill-current' : '']} />
										<span>{post.likes}</span>
										<span class="sr-only">appreciations</span>
									</button>
									<span class="hidden text-xs sm:inline">{post.views} views</span>
									<button
										class={['reaction motion-state', post.bookmarked ? 'text-foreground' : '']}
										aria-label={post.bookmarked ? 'Remove from saved notes' : 'Save note'}
										aria-pressed={post.bookmarked}
										onclick={() => toggleReaction(post.id, 'bookmarked')}
									>
										<BookmarkIcon class={['size-[18px]', post.bookmarked ? 'fill-current' : '']} />
									</button>
								</div>

								{#if openThreadId === post.id}
									<div
										id={`thread-${post.id}`}
										class="mt-4"
										transition:slide={{ duration: prefersReducedMotion.current ? 0 : 210 }}
									>
										<Separator class="mb-4" />
										{#if post.replies.length}
											<div class="grid gap-4">
												{#each post.replies as reply (reply.id)}
													<div class="flex gap-3">
														<Avatar class="size-8 shrink-0">
															<AvatarFallback class={avatarTone(reply.author)}
																>{reply.author.initials}</AvatarFallback
															>
														</Avatar>
														<div class="min-w-0 rounded-2xl bg-muted/70 px-3 py-2.5 text-sm">
															<p>
																<strong>{reply.author.name}</strong>
																<span class="text-xs text-muted-foreground">· {reply.time}</span>
															</p>
															<p class="mt-1 leading-relaxed">{reply.content}</p>
															<p class="mt-1 text-xs text-muted-foreground">
																{reply.likes} appreciations
															</p>
														</div>
													</div>
												{/each}
											</div>
										{:else}
											<p class="text-sm text-muted-foreground">
												No replies yet. Start the conversation thoughtfully.
											</p>
										{/if}
										<div class="mt-4 flex items-center gap-2">
											<Input
												aria-label={`Reply to ${post.author.name}`}
												placeholder="Write a reply…"
												value={replyDraft}
												oninput={(event) => (replyDraft = event.currentTarget.value)}
												maxlength={320}
												onkeydown={(event) => {
													if (event.key === 'Enter') {
														event.preventDefault();
														sendReply(post.id);
													}
												}}
												class="rounded-full"
											/>
											<IconButton
												icon={SendIcon}
												label="Send reply"
												disabled={!replyDraft.trim()}
												onclick={() => sendReply(post.id)}
												variant="secondary"
												size="sm"
											/>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</article>
				{:else}<p class="p-8 text-muted-foreground" role="status">
						No notes here yet. Try another search, follow a person, or publish your first note.
					</p>
				{/each}
			</section>
		</main>

		<aside class="sticky top-16 hidden h-[calc(100svh-4rem)] border-l lg:block">
			<ScrollArea class="h-full" edgeBlur="vertical" edgeBlurSize={32}>
				<div class="grid gap-5 p-4 xl:p-6">
					<Card.Root class="shadow-none">
						<Card.Header class="pb-3">
							<Card.Title class="text-base">People to know</Card.Title>
							<Card.Description>Thoughtful voices from nearby circles.</Card.Description>
						</Card.Header>
						<Card.Content class="grid gap-4">
							{#each suggestions as person (person.id)}
								<div class="flex items-center gap-3">
									<Avatar class="size-9 shrink-0">
										<AvatarFallback class={avatarTone(person)}>{person.initials}</AvatarFallback>
									</Avatar>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-medium">{person.name}</p>
										<p class="truncate text-xs text-muted-foreground">{person.role}</p>
									</div>
									<Button
										size="sm"
										variant={following.has(person.id) ? 'secondary' : 'outline'}
										class="h-8 rounded-full px-3"
										aria-pressed={following.has(person.id)}
										onclick={() => toggleFollow(person)}
									>
										{#if following.has(person.id)}<CheckIcon class="size-3.5" />{/if}
										{following.has(person.id) ? 'Following' : 'Follow'}
									</Button>
								</div>
							{/each}
						</Card.Content>
					</Card.Root>

					<Card.Root class="shadow-none">
						<Card.Header class="pb-2">
							<Card.Title class="text-base">Gathering momentum</Card.Title>
						</Card.Header>
						<Card.Content class="grid gap-1 p-2">
							{#each topics as topic, index (topic.label)}
								<button
									onclick={() => {
										chooseNav('Discover');
										search =
											topic.label === 'City fieldwork'
												? 'Field notes'
												: topic.label === 'Calm technology'
													? 'software'
													: topic.label;
									}}
									class="flex items-start gap-3 rounded-xl p-3 text-left motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
								>
									<span class="mt-0.5 text-xs font-medium text-muted-foreground">0{index + 1}</span>
									<span>
										<span class="block text-sm font-medium">{topic.label}</span>
										<span class="text-xs text-muted-foreground">{topic.posts}</span>
									</span>
								</button>
							{/each}
						</Card.Content>
					</Card.Root>

					<p class="px-2 text-xs leading-relaxed text-muted-foreground">
						Mosaic is a fictional interface built with Bedrock UI. No real people or posts are
						represented.
					</p>
				</div>
			</ScrollArea>
		</aside>
	</div>

	<nav
		class="fixed right-0 bottom-0 left-0 z-40 grid grid-cols-5 border-t bg-background/92 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
		aria-label="Mobile navigation"
	>
		{#each navItems.slice(0, 2) as item (item.label)}
			<button
				class={[
					'flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] motion-state',
					activeNav === item.label ? 'text-foreground' : 'text-muted-foreground'
				]}
				aria-pressed={activeNav === item.label}
				onclick={() => chooseNav(item.label)}
			>
				<item.icon class="size-5" />
				{item.label}
			</button>
		{/each}
		<button
			class="mx-auto -mt-3 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
			onclick={() => document.querySelector<HTMLTextAreaElement>('#new-note')?.focus()}
			aria-label="Write a new note"
		>
			<PenLineIcon class="size-5" />
		</button>
		<button
			class="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] text-muted-foreground motion-state"
			onclick={() => (notificationsOpen = true)}
		>
			<BellIcon class="size-5" /> Updates
			{#if unreadCount}<span
					class="absolute top-2 right-[30%] size-2 rounded-full bg-orange-500 ring-2 ring-background"
				></span>{/if}
		</button>
		<button
			class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.68rem] text-muted-foreground motion-state"
			onclick={() => chooseNav('Profile')}
		>
			<UserRoundIcon class="size-5" /> Profile
		</button>
	</nav>
</div>

<Sheet.Root
	open={selectedProfile !== null}
	onOpenChange={(open) => {
		if (!open) navigate({ profile: null });
	}}
>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>{selectedProfile?.name ?? 'Profile'}</Sheet.Title>
			<Sheet.Description>{selectedProfile?.handle} · {selectedProfile?.role}</Sheet.Description>
		</Sheet.Header>
		{#if selectedProfile}
			{@const person = selectedProfile}
			<div class="grid gap-5 p-5">
				<Avatar class="size-20"
					><AvatarFallback class={avatarTone(person)}>{person.initials}</AvatarFallback></Avatar
				>
				<p>
					{person.id === 'mina'
						? profileBio
						: 'Sharing observations about thoughtful work and everyday places. Based nearby, curious about what comes next.'}
				</p>
				{#if person.id === 'mina'}<Button onclick={() => chooseNav('Profile')}
						>View your profile</Button
					>{:else}
					<Button aria-pressed={following.has(person.id)} onclick={() => toggleFollow(person)}
						>{following.has(person.id) ? 'Unfollow' : 'Follow'} {person.name}</Button
					>
				{/if}
				<h3 class="font-semibold">Recent notes</h3>
				{#each posts.filter((post) => post.author.id === person.id) as post (post.id)}<p
						class="border-b pb-4 text-sm leading-relaxed"
					>
						{post.content}
					</p>{:else}<p class="text-sm text-muted-foreground">No notes published yet.</p>{/each}
			</div>
		{/if}
	</Sheet.Content>
</Sheet.Root>

<style>
	.screen-intro {
		animation: screen-enter var(--motion-enter) var(--motion-ease-enter) both;
	}
	.profile-cover {
		background: radial-gradient(
			ellipse at top right,
			color-mix(in oklab, var(--primary) 14%, transparent),
			transparent 70%
		);
	}
	@keyframes screen-enter {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.post-card {
		transition: background-color var(--motion-state) var(--motion-ease-enter);
	}

	.post-card:hover {
		background: color-mix(in oklab, var(--muted) 28%, transparent);
	}

	.reaction {
		display: inline-flex;
		min-width: 2.75rem;
		min-height: 2.75rem;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		border-radius: 999px;
		font-size: 0.75rem;
	}

	.reaction:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.reaction:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.visual-note {
		transition:
			transform var(--motion-state) var(--motion-ease-enter),
			box-shadow var(--motion-state) var(--motion-ease-enter);
	}

	.post-card:hover .visual-note {
		transform: translateY(-1px);
		box-shadow: 0 12px 32px -24px color-mix(in oklab, var(--foreground) 45%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.screen-intro,
		.post-card,
		.visual-note,
		:global(.social-shell *) {
			scroll-behavior: auto !important;
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}
	}
</style>
