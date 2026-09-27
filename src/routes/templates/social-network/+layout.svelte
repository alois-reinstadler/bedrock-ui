<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import House from '@lucide/svelte/icons/house';
	import Search from '@lucide/svelte/icons/search';
	import Bell from '@lucide/svelte/icons/bell';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import User from '@lucide/svelte/icons/user-round';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import Feather from '@lucide/svelte/icons/feather';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { base, people } from '#lib/templates/social-network/data.js';
	import { createSocial } from '#lib/templates/social-network/state.svelte.js';
	import './social.css';
	let { children } = $props();
	const social = createSocial();
	const nav = [
		{ label: 'Home', href: base, icon: House },
		{ label: 'Explore', href: `${base}/explore`, icon: Search },
		{ label: 'Notifications', href: `${base}/notifications`, icon: Bell },
		{ label: 'Bookmarks', href: `${base}/bookmarks`, icon: Bookmark },
		{ label: 'Profile', href: `${base}/profile/mina`, icon: User }
	];
	const unread = $derived(social.notifications.filter((item) => !item.read).length);
	let rightSearch = $state('');
</script>

<svelte:head
	><title>Mosaic — Social</title><meta
		name="description"
		content="A social feed template with real routes, rich media, and conversations."
	/></svelte:head
>
<div class="mosaic-app">
	<div class="social-shell">
		<aside class="social-sidebar">
			<a class="mosaic-brand" href={base} aria-label="Mosaic home"
				><span class="brand-mark"><Feather size={25} /></span><span>mosaic</span></a
			>
			<nav class="desktop-nav" aria-label="Social primary navigation">
				{#each nav as item (item.href)}<a
						href={item.href}
						class:active={page.url.pathname === item.href}
						aria-current={page.url.pathname === item.href ? 'page' : undefined}
						><span class="nav-icon"
							><item.icon size={24} />{#if item.label === 'Notifications' && unread}<i>{unread}</i
								>{/if}</span
						><span>{item.label}</span></a
					>{/each}
			</nav>
			<Button class="primary-button compose-shortcut" href={`${base}#social-compose`}
				><Feather size={19} /><span>Post</span></Button
			>
			<div class="account-area">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}<button
								{...props}
								class="account-button"
								aria-label="Open account menu"
								><img class="avatar" src="/templates/social-network/mina.jpg" alt="" /><span
									><strong>{social.profileName}</strong><small>@mina</small></span
								><Ellipsis size={19} /></button
							>{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" align="start" sideOffset={10} class="w-60 p-2">
						<DropdownMenu.Label class="px-3 py-2 text-xs text-muted-foreground"
							>Signed in as @mina</DropdownMenu.Label
						>
						<DropdownMenu.Separator />
						<DropdownMenu.Item class="px-3 py-3"
							>{#snippet child({ props })}<a {...props} href={`${base}/profile/mina`}
									>View your profile</a
								>{/snippet}</DropdownMenu.Item
						>
						<DropdownMenu.Item class="px-3 py-3"
							>{#snippet child({ props })}<a {...props} href={`${base}/bookmarks`}>Your bookmarks</a
								>{/snippet}</DropdownMenu.Item
						>
						<DropdownMenu.Item class="px-3 py-3"
							>{#snippet child({ props })}<a
									{...props}
									href="/templates/social-network/CREDITS.md"
									target="_blank"
									rel="noreferrer">About this demo & media</a
								>{/snippet}</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</aside>
		<main class="social-main" id="social-main">{@render children()}</main>
		<aside class="social-discovery" aria-label="Discover people and topics">
			<form class="search-field" action={`${base}/explore`}>
				<Search size={19} /><Input
					aria-label="Search Mosaic"
					name="q"
					placeholder="Search Mosaic"
					value={rightSearch}
					oninput={(event) => (rightSearch = event.currentTarget.value)}
				/>
			</form>
			<section class="discovery-section">
				<div class="section-heading">
					<h2>Trending now</h2>
					<span class="live-dot"></span>
				</div>
				<a class="featured-topic" href={`${base}/explore?q=Photography`}
					><img
						src="/templates/social-network/city.jpg"
						alt="A neon-lit city street after dark"
					/><span
						><small>PHOTOGRAPHY</small><strong>The world after dark</strong><span
							>See what’s being shared <ArrowUpRight size={14} /></span
						></span
					></a
				>
				{#each [{ label: 'Design', count: '8,240 posts', title: 'Less, but better' }, { label: 'Film', count: '2,186 posts', title: 'Independent film' }, { label: 'Architecture', count: '5,409 posts', title: 'Human-scale cities' }] as topic (topic.label)}<a
						class="trend-row"
						href={`${base}/explore?q=${topic.label}`}
						><span
							><small>{topic.label} · Trending</small><strong>{topic.title}</strong><small
								>{topic.count}</small
							></span
						><ArrowUpRight size={16} /></a
					>{/each}
			</section>
			<section class="discovery-section">
				<h2>Who to follow</h2>
				<div class="follow-list">
					{#each people.filter((person) => person.handle !== 'mina' && person.handle !== 'leo') as person (person.handle)}<div
							class="follow-row"
						>
							<a href={`${base}/profile/${person.handle}`}
								><img
									class="avatar"
									src={`/templates/social-network/${person.avatar}.jpg`}
									alt=""
								/><span><strong>{person.name}</strong><small>@{person.handle}</small></span></a
							><button
								class="follow-button"
								class:following={social.following.includes(person.handle)}
								aria-label={`${social.following.includes(person.handle) ? 'Unfollow' : 'Follow'} ${person.name}`}
								aria-pressed={social.following.includes(person.handle)}
								onclick={() => social.toggle('following', person.handle)}
								>{social.following.includes(person.handle) ? 'Following' : 'Follow'}</button
							>
						</div>{/each}
				</div>
				<a class="text-link" href={`${base}/explore`}>Show more</a>
			</section>
			<footer class="social-footer">
				<a href="/templates/social-network/CREDITS.md" target="_blank" rel="noreferrer"
					>Media credits</a
				><span>Fictional demo · © 2026 Mosaic</span>
			</footer>
		</aside>
	</div>
	<nav class="mobile-nav" aria-label="Mobile navigation">
		{#each nav as item (item.href)}<a
				href={item.href}
				class:active={page.url.pathname === item.href}
				aria-label={item.label}
				aria-current={page.url.pathname === item.href ? 'page' : undefined}
				><item.icon size={23} /></a
			>{/each}
	</nav>
	<p class="social-announcement" role="status" aria-live="polite">{social.announcement}</p>
</div>
