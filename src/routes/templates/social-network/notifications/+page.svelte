<script lang="ts">
	import Heart from '@lucide/svelte/icons/heart';
	import User from '@lucide/svelte/icons/user-round';
	import Repeat from '@lucide/svelte/icons/repeat-2';
	import { base, person } from '#lib/templates/social-network/data.js';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	const social = useSocial();
	let unreadOnly = $state(false);
	const notifications = $derived(social.notifications.filter((item) => !unreadOnly || !item.read));
</script>

<header class="feed-header">
	<div class="header-title">
		<h1>Notifications</h1>
		<button
			class="small-button"
			onclick={() => social.notifications.forEach((item) => (item.read = true))}
			>Mark all read</button
		>
	</div>
	<div class="feed-tabs">
		<button
			class:active={!unreadOnly}
			aria-pressed={!unreadOnly}
			onclick={() => (unreadOnly = false)}>All</button
		><button class:active={unreadOnly} aria-pressed={unreadOnly} onclick={() => (unreadOnly = true)}
			>Unread</button
		>
	</div>
</header>
{#each notifications as item (item.id)}{@const author = person(item.author)}
	<article class="notification-row" class:unread={!item.read}>
		<span class="notification-kind"
			>{#if item.kind.includes('liked')}<Heart
					size={23}
				/>{:else if item.kind.includes('following')}<User size={23} />{:else}<Repeat
					size={23}
				/>{/if}</span
		>
		<div>
			<a href={`${base}/profile/${author.handle}`}
				><img
					class="avatar"
					src={`/templates/social-network/${author.avatar}.jpg`}
					alt={`${author.name} profile`}
				/></a
			>
			<p>
				<a
					href={item.post ? `${base}/post/${item.post}` : `${base}/profile/${author.handle}`}
					onclick={() => (item.read = true)}><strong>{author.name}</strong> {item.kind}</a
				>
			</p>
			<small>{item.time} ago</small>
		</div>
		{#if !item.read}<button
				aria-label={`Mark notification from ${author.name} read`}
				onclick={() => (item.read = true)}>Mark read</button
			>{/if}
	</article>{:else}<div class="empty-state">
		<h2>You’re up to date.</h2>
		<p>No unread notifications.</p>
	</div>{/each}
