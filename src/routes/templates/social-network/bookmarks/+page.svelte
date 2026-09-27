<script lang="ts">
	import Post from '#lib/templates/social-network/Post.svelte';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	const social = useSocial();
	const posts = $derived(social.posts.filter((post) => social.saved.includes(post.id)));
</script>

<header class="feed-header">
	<div class="header-title">
		<div>
			<h1>Bookmarks</h1>
			<p>Only you can see these</p>
		</div>
	</div>
</header>
{#each posts as post (post.id)}<Post {post} />{:else}<div class="empty-state">
		<h2>Keep a good post close.</h2>
		<p>Bookmark posts from your timeline to find them here.</p>
	</div>{/each}
