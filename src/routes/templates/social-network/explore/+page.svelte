<script lang="ts">
	import { Input } from '#lib/bedrock/ui/input';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import Search from '@lucide/svelte/icons/search';
	import { base, people } from '#lib/templates/social-network/data.js';
	import Post from '#lib/templates/social-network/Post.svelte';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	const social = useSocial();
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	const query = $derived(mounted ? (page.url.searchParams.get('q') ?? '') : '');
	const posts = $derived(
		social.posts.filter((post) =>
			`${post.text} ${post.topic} ${post.author}`.toLowerCase().includes(query.toLowerCase())
		)
	);
	const results = $derived(
		people.filter(
			(person) =>
				person.handle !== 'mina' &&
				`${person.name} ${person.handle} ${person.bio}`.toLowerCase().includes(query.toLowerCase())
		)
	);
</script>

<header class="feed-header"><div class="header-title"><h1>Explore</h1></div></header>
<div class="page-search">
	<form class="search-field" action={`${base}/explore`}>
		<Search size={19} /><Input
			aria-label="Search posts and people"
			name="q"
			value={query}
			placeholder="Search posts and people"
		/><button class="small-button" type="submit">Search</button>
	</form>
</div>
{#if results.length}<section class="people-results" aria-label="People">
		<h2>People</h2>
		{#each results as person (person.handle)}<div class="follow-row">
				<a href={`${base}/profile/${person.handle}`}
					><img class="avatar" src={`/templates/social-network/${person.avatar}.jpg`} alt="" /><span
						><strong>{person.name}</strong><small>@{person.handle} · {person.bio}</small></span
					></a
				><button
					class="follow-button"
					class:following={social.following.includes(person.handle)}
					aria-label={`${social.following.includes(person.handle) ? 'Unfollow' : 'Follow'} ${person.name}`}
					aria-pressed={social.following.includes(person.handle)}
					onclick={() => social.toggle('following', person.handle)}
					>{social.following.includes(person.handle) ? 'Following' : 'Follow'}</button
				>
			</div>{/each}
	</section>{/if}
{#each posts as post (post.id)}<Post {post} />{:else}<div class="empty-state">
		<h2>No posts found</h2>
		<p>Try a person, photography, film, or design.</p>
	</div>{/each}
