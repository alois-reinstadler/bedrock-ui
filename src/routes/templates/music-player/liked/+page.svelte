<script lang="ts">
	import { tracks } from '#lib/templates/music-player/data.js';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import TrackList from '#lib/templates/music-player/TrackList.svelte';
	const player = usePlayer();
</script>

<svelte:head><title>Liked songs — Drift</title></svelte:head>
<div class="page-heading">
	<p class="eyebrow">SAVED FOR ANOTHER LISTEN</p>
	<h1>Liked songs</h1>
	<p>{player.liked.length} songs you love.</p>
</div>
<TrackList
	items={tracks.filter((track) => player.liked.includes(track.id))}
	empty="Tap the heart beside a song to save it here."
/>
