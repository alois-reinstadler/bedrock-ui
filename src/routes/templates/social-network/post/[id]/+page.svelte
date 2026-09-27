<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { base } from '#lib/templates/social-network/data.js';
	import Post from '#lib/templates/social-network/Post.svelte';
	import Composer from '#lib/templates/social-network/Composer.svelte';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	let { data }: { data: { id: string } } = $props();
	const social = useSocial();
	const post = $derived(social.posts.find((item) => item.id === data.id));
</script>

<header class="feed-header">
	<div class="header-title">
		<div class="back-heading">
			<a href={base} aria-label="Back to home"><ArrowLeft size={21} /></a>
			<h1>Post</h1>
		</div>
	</div>
</header>
{#if post}<Post {post} detail />
	<section id="replies" aria-label="Replies">
		<Composer
			replyTo={post.id}
		/>{#each social.replies[post.id] ?? [] as reply, index (`${post.id}-${index}`)}<article
				class="reply-row"
			>
				<img class="avatar" src="/templates/social-network/mina.jpg" alt="" />
				<div>
					<strong>{social.profileName}</strong><span class="handle"> @mina</span>
					<p>{reply}</p>
				</div>
			</article>{/each}
	</section>{:else}<div class="empty-state">
		<h2>This demo post is no longer available.</h2>
		<p><a href={base}>Return to your timeline</a></p>
	</div>{/if}
