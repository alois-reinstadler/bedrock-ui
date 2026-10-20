<script lang="ts">
	import { page } from '$app/state';

	import { collections } from '#lib/templates/music-player/data.js';

	import Icon from '@lucide/svelte/icons/audio-lines';

	import Heart from '@lucide/svelte/icons/heart';

	import Compass from '@lucide/svelte/icons/compass';
	import Library from '@lucide/svelte/icons/library';
	import Clock from '@lucide/svelte/icons/clock-3';

	const base = '/templates/music-player';
	const navigation = [
		{ path: '', label: 'Listen now', icon: Icon },
		{ path: '/discover', label: 'Discover', icon: Compass },
		{ path: '/library', label: 'Your library', icon: Library },
		{ path: '/liked', label: 'Liked songs', icon: Heart },
		{ path: '/recent', label: 'Recently played', icon: Clock }
	];
</script>

<aside class="sidebar">
	<a class="brand" href={base}
		><Icon size={24} /><span>drift<span class="brand-dot">.</span></span></a
	>
	<nav aria-label="Music navigation">
		{#each navigation as item (item.path)}<a
				href={base + item.path}
				class={[{ active: page.url.pathname === base + item.path }]}
				aria-current={page.url.pathname === base + item.path ? 'page' : undefined}
				><item.icon size={19} /><span>{item.label}</span></a
			>{/each}
	</nav>
	<div class="side-heading">YOUR COLLECTIONS <span>{collections.length}</span></div>
	<nav class="collection-nav" aria-label="Collections">
		{#each collections as collection (collection.id)}<a
				href={`${base}/album/${collection.id}`}
				class={[{ active: page.params.slug === collection.id }]}
				><img src={collection.artwork} alt="" /><span
					><strong>{collection.title}</strong><small>{collection.genre}</small></span
				></a
			>{/each}
	</nav>
	<a class="credits-link" href={`${base}/credits`}>Music & credits ↗</a>
	<div class="listener">
		<span class="avatar">JD</span><span
			><strong>Jamie Davis</strong><small>Personal library</small></span
		>
	</div>
</aside>

<style>
	.sidebar {
		border-right: 1px solid var(--border);
		padding: 28px 18px 16px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: auto;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 30px;
		font-weight: 750;
		letter-spacing: -1.5px;
		padding: 0 12px 30px;
	}
	.brand-dot {
		color: #c46b78;
	}
	.brand :global(svg) {
		color: #c46b78;
	}
	.sidebar nav {
		display: grid;
		gap: 4px;
	}
	.sidebar nav a {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 12px;
		border-radius: var(--radius-lg);
		font-size: 13px;
		color: var(--music-muted);
	}
	.sidebar nav a:hover,
	.sidebar nav a.active {
		background: var(--muted);
		color: var(--foreground);
	}
	.side-heading {
		display: flex;
		justify-content: space-between;
		margin: 32px 12px 14px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1.5px;
		color: var(--music-muted);
	}
	.sidebar .collection-nav a {
		padding: 8px;
		gap: 11px;
	}
	.collection-nav img {
		width: 38px;
		height: 38px;
		border-radius: 5px;
	}
	.collection-nav span,
	.listener > span:last-child {
		display: grid;
		gap: 3px;
	}
	.collection-nav strong {
		font-size: 12px;
		font-weight: 600;
		color: var(--foreground);
	}
	.collection-nav small,
	.listener small {
		font-size: 10px;
		color: var(--music-muted);
	}
	.credits-link {
		margin-top: auto;
		padding: 30px 12px 20px;
		font-size: 11px;
		color: var(--music-muted);
	}
	.listener {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 6px 0;
		border-top: 1px solid var(--border);
	}
	.avatar {
		display: grid;
		place-items: center;
		background: #cab9a3;
		color: #30281f;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		font-size: 11px;
	}
	.listener strong {
		font-size: 12px;
	}

	@media (max-width: 1050px) {
		.sidebar {
			padding-inline: 10px;
		}
	}
	@media (max-width: 680px) {
		.sidebar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 58px;
			z-index: 6;
			padding: 0;
			background: var(--background);
			border: 0;
			border-top: 1px solid var(--border);
		}
		.sidebar nav:first-of-type {
			display: flex;
			justify-content: space-around;
		}
		.sidebar nav:first-of-type a {
			display: grid;
			justify-items: center;
			gap: 4px;
			padding: 9px 5px;
			font-size: 8px;
		}
		.brand,
		.side-heading,
		.sidebar .collection-nav,
		.credits-link,
		.listener {
			display: none;
		}
	}
</style>
