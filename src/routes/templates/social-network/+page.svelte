<script lang="ts">
	import Composer from '#lib/templates/social-network/Composer.svelte';
	import Post from '#lib/templates/social-network/Post.svelte';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	const social = useSocial();
	let tab = $state('For you');
	const posts = $derived(
		tab === 'Following'
			? social.posts.filter(
					(post) => social.following.includes(post.author) || post.author === 'mina'
				)
			: social.posts
	);
</script>

<header class="feed-header">
	<div class="header-title">
		<h1>Home</h1>
		<span><i class="live-dot"></i>Your daily scroll</span>
	</div>
	<div class="feed-tabs" aria-label="Timeline filter">
		{#each ['For you', 'Following'] as item (item)}<button
				class:active={tab === item}
				aria-pressed={tab === item}
				onclick={() => (tab = item)}>{item}</button
			>{/each}
	</div>
</header>
<Composer />
<section aria-label="Timeline">
	{#each posts as post (post.id)}<Post {post} />{/each}
</section>
<p class="feed-end">You’re all caught up. A good time for a little fresh air.</p>
