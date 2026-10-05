<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { base, type Person } from '#lib/templates/social-network/data.js';
	import Post from '#lib/templates/social-network/Post.svelte';
	import { useSocial } from '#lib/templates/social-network/state.svelte.js';
	let { data }: { data: { profile: Person } } = $props();
	const social = useSocial();
	const profile = $derived(data.profile);
	const own = $derived(profile.handle === 'mina');
	const posts = $derived(
		social.posts.filter(
			(post) => post.author === profile.handle || (own && social.reposted.includes(post.id))
		)
	);
	let editing = $state(false);
	let name = $state('');
	let bio = $state('');
</script>

<header class="feed-header">
	<div class="header-title">
		<div class="back-heading">
			<a href={base} aria-label="Back to home"><ArrowLeft size={21} /></a>
			<div>
				<h1>{own ? social.profileName : profile.name}</h1>
				<p>{posts.length} posts</p>
			</div>
		</div>
	</div>
</header>
<div class="profile-cover"></div>
<section class="profile-summary" aria-label="Profile">
	<div class="profile-toolbar">
		<img
			class="profile-avatar"
			src={`/templates/social-network/${profile.avatar}.jpg`}
			alt={profile.name}
		/>{#if own}<Button
				variant="ghost"
				type="button"
				class={[
					'control-templates-social-network-profile-handle-page h-auto whitespace-normal',
					'small-button'
				]}
				onclick={() => {
					name = social.profileName;
					bio = social.profileBio;
					editing = !editing;
				}}>Edit profile</Button
			>{:else}<Button
				variant="ghost"
				type="button"
				class={[
					'control-templates-social-network-profile-handle-page h-auto whitespace-normal',
					'follow-button',
					{ following: social.following.includes(profile.handle) }
				]}
				aria-pressed={social.following.includes(profile.handle)}
				onclick={() => social.toggle('following', profile.handle)}
				>{social.following.includes(profile.handle) ? 'Following' : 'Follow'}</Button
			>{/if}
	</div>
	<h2>{own ? social.profileName : profile.name}</h2>
	<span class="handle">@{profile.handle}</span>
	<p>{own ? social.profileBio : profile.bio}</p>
	<div class="profile-stats">
		<span><MapPin size={12} style="display:inline;vertical-align:middle" /> {profile.location}</span
		><span>Joined March 2022</span>
	</div>
	<div class="profile-stats">
		<span><strong>{own ? social.following.length : 284}</strong> Following</span><span
			><strong>{profile.followers}</strong> Followers</span
		>
	</div>
</section>
{#if editing && own}<form
		class="profile-edit"
		onsubmit={(event) => {
			event.preventDefault();
			if (name.trim()) {
				social.profileName = name.trim();
				social.profileBio = bio.trim();
				editing = false;
			}
		}}
	>
		<label
			>Display name<Input
				class={['control-templates-social-network-profile-handle-page']}
				bind:value={name}
				required
				maxlength={40}
			/></label
		><label
			>Bio<Textarea
				class={['control-templates-social-network-profile-handle-page']}
				bind:value={bio}
				maxlength={160}
			></Textarea></label
		>
		<div>
			<Button
				variant="ghost"
				type="submit"
				class={[
					'control-templates-social-network-profile-handle-page h-auto whitespace-normal',
					'primary-button'
				]}>Save profile</Button
			><Button
				variant="ghost"
				type="button"
				class={[
					'control-templates-social-network-profile-handle-page h-auto whitespace-normal',
					'small-button'
				]}
				onclick={() => (editing = false)}>Cancel</Button
			>
		</div>
	</form>{/if}
{#each posts as post (post.id)}<Post {post} />{:else}<div class="empty-state">
		<h2>No posts yet</h2>
		<p>New posts will appear here.</p>
	</div>{/each}
