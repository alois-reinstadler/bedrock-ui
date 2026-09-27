<script lang="ts">
	import { collections } from '#lib/templates/music-player/data.js';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import CollectionGrid from '#lib/templates/music-player/CollectionGrid.svelte';
	const player = usePlayer();
</script>

<svelte:head><title>Your library — Drift</title></svelte:head>
<div class="page-heading">
	<p class="eyebrow">THE ONES YOU COME BACK TO</p>
	<h1>Your library</h1>
	<p>Your saved collections, together in one place.</p>
</div>
<div class="library-shortcuts">
	<a href="/templates/music-player/liked"
		><span>♡</span><strong>Liked songs</strong><small>{player.liked.length} songs</small></a
	><a href="/templates/music-player/recent"
		><span>↺</span><strong>Recently played</strong><small>{player.recent.length} songs</small></a
	>
</div>
<div class="section-heading">
	<h2>Saved collections</h2>
	<a href="/templates/music-player/discover">Find something new ↗</a>
</div>
{#if player.saved.length}<CollectionGrid
		items={collections.filter((item) => player.saved.includes(item.id))}
	/>{:else}<p>Save a collection to make it part of your library.</p>{/if}

<style>
	.library-shortcuts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		margin: 30px 0 42px;
	}
	.library-shortcuts a {
		display: grid;
		grid-template-columns: 50px 1fr;
		align-items: center;
		column-gap: 15px;
		padding: 20px;
		border: 1px solid var(--border);
		border-radius: 10px;
	}
	.library-shortcuts span {
		grid-row: 1/3;
		background: var(--muted);
		width: 50px;
		height: 50px;
		display: grid;
		place-items: center;
		font-size: 28px;
		border-radius: 9px;
		color: #c46b78;
	}
	.library-shortcuts strong {
		font-size: 13px;
	}
	.library-shortcuts small {
		font-size: 11px;
		color: var(--music-muted);
	}
	@media (max-width: 680px) {
		.library-shortcuts {
			grid-template-columns: 1fr;
			gap: 10px;
		}
		.library-shortcuts a {
			padding: 15px;
		}
	}
</style>
