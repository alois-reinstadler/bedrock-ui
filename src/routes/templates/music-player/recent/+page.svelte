<script lang="ts">
	import { tracks, type Track } from '#lib/templates/music-player/data.js';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import TrackList from '#lib/templates/music-player/TrackList.svelte';
	const player = usePlayer();
	const items = $derived(
		player.recent
			.map((id) => tracks.find((track) => track.id === id))
			.filter((track): track is Track => !!track)
	);
</script>

<svelte:head><title>Recently played — Drift</title></svelte:head>
<div class="page-heading">
	<p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p>
	<h1>Recently played</h1>
	<p>Your listening history, newest first.</p>
</div>
<TrackList {items} empty="Your listening history begins with your first play." />
