<script lang="ts">
	import { socialFilmSource } from '../media.js';
	import Heart from '@lucide/svelte/icons/heart';
	import Repeat from '@lucide/svelte/icons/repeat-2';
	import Message from '@lucide/svelte/icons/message-circle';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import Quote from '@lucide/svelte/icons/quote';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import { base, person, type Post } from './data.js';
	import { useSocial } from './state.svelte.js';
	import Composer from './Composer.svelte';
	let { post, detail = false }: { post: Post; detail?: boolean } = $props();
	const social = useSocial();
	const author = $derived(person(post.author));
	const quoted = $derived(social.posts.find((item) => item.id === post.quote));
	let quoting = $state(false);
	let noteHelpful = $state(false);
	const count = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
</script>

<article class="feed-post" data-post-id={post.id}>
	{#if post.repostedBy || social.reposted.includes(post.id)}<div class="repost-context">
			<Repeat size={13} />
			{social.reposted.includes(post.id) ? 'You' : person(post.repostedBy!).name} reposted
		</div>{/if}
	<div class="post-grid">
		<a
			class="avatar-link"
			href={`${base}/profile/${author.handle}`}
			aria-label={`${author.name} profile`}
			><img class="avatar" src={`/templates/social-network/${author.avatar}.jpg`} alt="" /></a
		>
		<div class="post-content">
			<div class="post-meta">
				<a class="author-name" href={`${base}/profile/${author.handle}`}
					>{author.handle === 'mina' ? social.profileName : author.name}</a
				><BadgeCheck class="verified" size={15} /><span class="handle">@{author.handle}</span><span
					>·</span
				><a href={`${base}/post/${post.id}`} class="post-time">{post.time}</a>
			</div>
			<a href={`${base}/post/${post.id}`} class="post-text">{post.text}</a>
			{#if post.image}<a href={`${base}/post/${post.id}`} class="post-media-link"
					><img
						class="post-media"
						src={`/templates/social-network/${post.image}.jpg`}
						alt={post.alt}
						loading="lazy"
					/></a
				>{/if}
			{#if post.video}<video
					class="post-media"
					controls
					playsinline
					preload="metadata"
					poster="/templates/social-network/bunny-social.jpg"
					aria-label="Open film excerpt"
					><source src={socialFilmSource} type="video/webm" /><track
						kind="captions"
						src="/templates/social-network/film.vtt"
						srclang="en"
						label="English"
					/></video
				><a
					class="media-credit"
					href="/templates/social-network/CREDITS.md"
					target="_blank"
					rel="noreferrer">Big Buck Bunny · Blender Foundation · CC BY 3.0</a
				>{/if}
			{#if quoted}<a class="quoted-post" href={`${base}/post/${quoted.id}`}
					><span class="quote-author"
						><img src={`/templates/social-network/${person(quoted.author).avatar}.jpg`} alt="" />
						<strong>{person(quoted.author).name}</strong><span>@{quoted.author}</span></span
					><span>{quoted.text}</span></a
				>{/if}
			{#if post.note}<aside class="community-note">
					<strong><BookOpen size={16} /> Readers added context</strong>
					<p>{post.note}</p>
					<div>
						<a href={post.noteSource} target="_blank" rel="noreferrer">Read source ↗</a><button
							aria-pressed={noteHelpful}
							onclick={() => (noteHelpful = !noteHelpful)}
							>{noteHelpful ? 'Thanks for your feedback' : 'Helpful?'}</button
						>
					</div>
				</aside>{/if}
			<div class="post-actions">
				<a href={`${base}/post/${post.id}#replies`} aria-label={`Reply to ${author.name}`}
					><Message size={18} /><span
						>{count(post.replies + (social.replies[post.id]?.length ?? 0))}</span
					></a
				>
				<button
					class:reposted={social.reposted.includes(post.id)}
					aria-label={`Repost ${author.name}'s post`}
					aria-pressed={social.reposted.includes(post.id)}
					onclick={() => social.toggle('reposted', post.id)}
					><Repeat size={18} /><span
						>{count(post.reposts + Number(social.reposted.includes(post.id)))}</span
					></button
				>
				<button
					class:liked={social.liked.includes(post.id)}
					aria-label={`Like ${author.name}'s post`}
					aria-pressed={social.liked.includes(post.id)}
					onclick={() => social.toggle('liked', post.id)}
					><Heart size={18} fill={social.liked.includes(post.id) ? 'currentColor' : 'none'} /><span
						>{count(post.likes + Number(social.liked.includes(post.id)))}</span
					></button
				>
				<button
					aria-label={`Quote ${author.name}'s post`}
					aria-expanded={quoting}
					onclick={() => (quoting = !quoting)}><Quote size={18} /></button
				>
				<button
					class:accent={social.saved.includes(post.id)}
					aria-label={social.saved.includes(post.id) ? 'Remove bookmark' : 'Bookmark post'}
					aria-pressed={social.saved.includes(post.id)}
					onclick={() => social.toggle('saved', post.id)}
					><Bookmark
						size={18}
						fill={social.saved.includes(post.id) ? 'currentColor' : 'none'}
					/></button
				>
			</div>
			{#if quoting}<div class="quote-compose">
					<strong>Quote this post</strong><Composer
						quote={post.id}
						ondone={() => (quoting = false)}
					/>
				</div>{/if}
		</div>
	</div>
	{#if detail}<div class="detail-meta">
			10:24 AM · September 22, 2026 · <strong>{count(post.likes * 23)} views</strong>
		</div>{/if}
</article>
